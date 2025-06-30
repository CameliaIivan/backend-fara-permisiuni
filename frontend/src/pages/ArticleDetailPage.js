import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Card from "../components/Card";
import Button from "../components/Button";
import Alert from "../components/Alert";
import { getArticleById } from "../services/articleService";

// Creează un serviciu temporar pentru articole
// const getArticleById = async (id) => {
//   return {
//     id_articol: id,
//     titlu: "Articol de test",
//     continut: "Conținut de test pentru articol",
//     data_crearii: new Date().toISOString()
//   };
// };

function ArticleDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const data = await getArticleById(id);
        setArticle(data);
      } catch (error) {
        console.error("Error fetching article:", error);
        setError("A apărut o eroare la încărcarea articolului. Vă rugăm încercați din nou.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Se încarcă articolul...</div>;
  }

  if (error) {
    return (
      <Alert type="error" className="my-8">
        {error}
      </Alert>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Articolul nu a fost găsit</h2>
        <Link to="/articles">
          <Button>Înapoi la articole</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Link to="/articles">
          <Button variant="outline">&larr; Înapoi la articole</Button>
        </Link>
        {isAdmin && (
          <Link to={`/admin/articles/edit/${article.id_articol}`}>
            <Button>Editează articolul</Button>
          </Link>
        )}
      </div>

      <Card>
        <Card.Body>
          <h1 className="text-3xl font-bold mb-4">{article.titlu}</h1>
          <div className="flex items-center text-gray-500 mb-6">
            <span>Publicat: {new Date(article.data_crearii).toLocaleDateString("ro-RO")}</span>
            {article.categorie && (
              <>
                <span className="mx-2">•</span>
                <span>Categorie: {article.categorie.nume}</span>
              </>
            )}
          </div>
          <div className="prose max-w-none">
            <p className="whitespace-pre-line">{article.continut}</p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ArticleDetailPage;