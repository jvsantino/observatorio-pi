export default function PDFViewer({ url }) {
  return (
    <iframe
      src={url}
      title="Visualizador de PDF"
      className="w-full h-[80vh] border rounded"
    />
  );
}
