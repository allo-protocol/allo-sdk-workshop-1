export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-900">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900">Page not found</h2>
        <p className="text-xl text-gray-600">
          { "Sorry, we couldn't find the page you're looking for." }
        </p>
      </div>
    </div>
  );
}
