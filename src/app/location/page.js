export default function Location() {
  return (
    <div className="py-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Our Location</h1>
      <div className="max-w-4xl mx-auto">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d... (your embed code)"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        />
        <p className="mt-4 text-center">Iqra Dars Udinur, [Address], [City], [Country]</p>
      </div>
    </div>
  );
}