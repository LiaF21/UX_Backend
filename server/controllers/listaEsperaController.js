const listaEsperaService = require('../services/listaEsperaService');
 
 exports.getAllListaEspera = async (req,res) =>{
  
  try{
    const lista = await listaEsperaService.getAllListaEspera();
    res.json(lista)
    } catch (error){
      res.status(500).json({ error: error.message });
    }
}

exports.crearEspera= async (req,res) =>{
  try{
    const espera= await listaEsperaService.crearListaEspera(req)
    console.log ("creando espera")
     res.json(espera);
    } catch (error){
      res.status(500).json({ error: error.message });
    }
    
}
exports.getListaEspera = async (req,res) =>{
  try {
    const espera = await listaEsperaService.getEspera(req)
    if(!espera) return res.status(404).json({message: 'No existe espera'})
    res.json(espera)
  } catch (error) {
    res.status(500).json({error:error.message});
  }
  
}
exports.editarEspera = async (req,res) =>{

try {
  const editar = await listaEsperaService.editarListaEspera(req); 
  res.json(editar)
  
} catch (error) {
  res.status(500).json({ error: error.message });
}


}


exports.eliminarEspera = async (req,res) =>{
  try {
    await listaEsperaService.eliminarEspera(req);
    res.status(200).json({ ok: "Si funciona" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  

}
