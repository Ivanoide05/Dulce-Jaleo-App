const fs = require('fs');

const originalWfStr = fs.readFileSync('C:/Users/ezequiel/.gemini/antigravity/brain/e32594e0-62fd-43d4-ade7-4a4211052b7e/.system_generated/steps/774/output.txt', 'utf8').trim();
const rawJSON = JSON.parse(originalWfStr);

let wfData = null;
if (rawJSON.nodes) wfData = rawJSON;
else if (rawJSON.data && rawJSON.data.nodes) wfData = rawJSON.data;
else if (rawJSON.output && typeof rawJSON.output === 'string') {
    try {
        const parsed = JSON.parse(rawJSON.output);
        wfData = parsed.data || parsed;
    } catch(e){}
} else if (rawJSON.output && rawJSON.output.nodes) {
    wfData = rawJSON.output;
} else if (rawJSON.output && rawJSON.output.data && rawJSON.output.data.nodes) {
    wfData = rawJSON.output.data;
}

const analyzeNode = wfData.nodes.find(n => n.name === 'Analyze image');

const originalPrompt = "Analiza esta imagen y extrae la siguiente informacion en formato JSON estricto:\n\n1. **proveedor**: Nombre del emisor o 'Desconocido'.\n2. **cif_emisor**: CIF/NIF del emisor.\n3. **fecha**: Fecha de emision (YYYY-MM-DD).\n4. **numero_doc**: Numero de factura/ticket.\n5. **base_imponible**: Importe sin impuestos (numero).\n6. **iva_total**: Total de impuestos (numero).\n7. **total_final**: Importe total pagado (numero).\n8. **moneda**: Codigo de moneda (ej. EUR).\n9. **detalles**: Lista de productos o descripcion breve.\n10. **tabla_destino**: Clasifica el documento como 'FACTURAS' (si es factura o compra identificable), 'ALBARANES' (si es entrega sin precio o nota de envio), o 'GASTOS CAJA' (si es un gasto menor u otro).\n\nDevuelve UNICAMENTE el objeto JSON sin markdown extra ni texto.";

const injection = "\n\n[INSTRUCCION CRITICA REQUERIDA POR EL DASHBOARD]: Si el documento contiene las palabras 'FACTURA', 'Factura', 'factura', 'FACTURA SIMPLIFICADA' o 'TICKET', el campo tabla_destino DEBE ser EXACTAMENTE: FACTURAS. Si es un albaran o nota de entrega, DEBE ser EXACTAMENTE: ALBARANES. Si es un gasto de caja miscelaneo que NO es factura ni ticket de compra para contabilidad general, DEBE ser: GASTOS CAJA. Usa estrictamente una de estas tres claves literales en MAYUSCULAS obligatoriamente, sin texto extra.";

analyzeNode.parameters.prompt = originalPrompt + injection;

fs.writeFileSync('C:/Users/ezequiel/Desktop/CARPETA MILLONARIOS/automatizaciones n8n con antigravity/final_payload_mcp.json', JSON.stringify({
  id: '7ZSv1omradULzuzHTJXSt',
  nodes: wfData.nodes,
  connections: wfData.connections
}, null, 2));

console.log('PATCH COMPLETADO Y GUARDADO EN final_payload_mcp.json');
