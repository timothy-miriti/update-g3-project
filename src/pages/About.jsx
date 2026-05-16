import { Link } from 'react-router-dom';

export default function About() {
  return (
    <section className="about-page">
      <h1>About</h1>
      <p>MovieHub helps you browse current movies, search titles, and keep a watchlist.</p>
      <Link className="primary-action" to="/">Back to movies</Link>
    </section>
  );
}
