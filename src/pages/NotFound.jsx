import { Link } from 'react-router-dom';
import PartDrawing from '../components/PartDrawing';

export default function NotFound() {
  return (
    <section className="container-x flex flex-col items-center py-20 text-center">
      <div className="drawing-bg flex w-full max-w-md items-center justify-center rounded-2xl p-6">
        <PartDrawing style="nut" className="w-3/4" title="Line drawing of a hex nut" />
      </div>
      <p className="eyebrow mt-8">Error 404</p>
      <h1 className="mt-2 text-3xl font-extrabold">This page is out of tolerance</h1>
      <p className="mt-3 max-w-md text-muted">The page you are looking for doesn’t exist or has moved.</p>
      <div className="mt-7 flex gap-3">
        <Link to="/" className="btn btn-primary">
          Back to home
        </Link>
        <Link to="/products" className="btn btn-outline">
          View products
        </Link>
      </div>
    </section>
  );
}
