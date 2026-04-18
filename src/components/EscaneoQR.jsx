import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { X, Camera } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const EscaneoQR = ({ userId, alCerrar }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    // Cambiamos a arrow function para evitar problemas de contexto 'this'
    const onScanSuccess = async (decodedText) => {
      const puntoId = decodedText;
      
      try {
        await scanner.clear(); // Apagamos la cámara al detectar éxito
        toast.info("Conectando con el bote...");
        
        // Llamada a LOCALHOST 8080
        await axios.post(
          `http://localhost:8080/api/iot/abrir-sesion?userId=${userId}&puntoId=${puntoId}`
        );
        
        toast.success("Bote activado. ¡Deposita el plástico!", {
           description: "La balanza industrial está esperando el peso."
        });
        
        setTimeout(alCerrar, 2500);

      } catch (err) { // Logueamos err para evitar el warning de variable no usada
        console.error("Fallo al sincronizar con el bote:", err);
        toast.error("Error en comunicación", { description: "QR no reconocido o bote fuera de línea." });
        alCerrar();
      }
    };

    scanner.render(onScanSuccess);

    // Limpieza al desmontar el componente
    return () => {
        scanner.clear().catch(e => console.warn("Cerrando scanner...", e));
    };
  }, [userId, alCerrar]);

  return (
    <div className="fixed inset-0 bg-slate-900/95 z-[200] flex flex-col items-center justify-center p-6 text-white backdrop-blur-md">
      <button onClick={alCerrar} className="absolute top-10 right-10 p-4 bg-white/10 rounded-full hover:bg-white/20 active:scale-90 transition-all">
        <X size={32} />
      </button>
      
      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="p-5 bg-green-500/20 rounded-[2rem] border-2 border-green-500 animate-pulse">
            <Camera size={38} className="text-green-500" />
        </div>
        <h3 className="text-2xl font-black uppercase tracking-tighter">Escanea el Punto</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center px-8 leading-tight">
            Ubica el código pegado en la estación <br /> para iniciar la recepción inteligente.
        </p>
      </div>

      <div id="reader" className="w-full max-w-sm rounded-[3rem] overflow-hidden border-8 border-white/5 bg-black shadow-2xl"></div>
    </div>
  );
};

export default EscaneoQR;