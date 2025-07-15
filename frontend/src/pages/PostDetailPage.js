import {useCallback,  useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getPostById,
  likePost,
  unlikePost,
  createComment,
  updateComment,
} from "../services/socialService";
import Card from "../components/Card";
import Button from "../components/Button";
import Textarea from "../components/Textarea";
import Alert from "../components/Alert";
import { useAuth } from "../contexts/AuthContext";

function PostDetailPage() {
  const { id } = useParams();
  const { currentUser } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const fetchPost = useCallback(async () => {
  try {
    setLoading(true);
    const data = await getPostById(id);
    setPost(data);
  } catch (err) {
    console.error("Error fetching post", err);
    setError("A apărut o eroare la încărcarea postării.");
  } finally {
    setLoading(false);
  }
}, [id]); // id e necesar în dependențe

useEffect(() => {
  fetchPost();
}, [fetchPost]);
  const hasLiked = post?.likes?.some((l) => l.id_utilizator === currentUser?.id);

  const handleLike = async () => {
    try {
      if (hasLiked) {
        await unlikePost(post.id_postare);
      } else {
        await likePost(post.id_postare);
      }
      fetchPost();
    } catch (err) {
      console.error("Error liking post", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await createComment({ id_postare: post.id_postare, continut: newComment });
      setNewComment("");
      fetchPost();
    } catch (err) {
      console.error("Error adding comment", err);
    }
  };

  const startEdit = (comment) => {
    setEditingId(comment.id_comentariu);
    setEditingContent(comment.continut);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingContent("");
  };

  const handleUpdateComment = async (commentId) => {
    try {
      await updateComment(commentId, { continut: editingContent });
      cancelEdit();
      fetchPost();
    } catch (err) {
      console.error("Error updating comment", err);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Se încarcă postarea...</div>;
  }

  if (error) {
    return (
      <Alert type="error" className="my-8">
        {error}
      </Alert>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Postarea nu a fost găsită</h2>
        <Link to="/my-posts">
          <Button>Înapoi</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Link to="/my-posts">
          <Button variant="outline">&larr; Înapoi</Button>
        </Link>
      </div>

      <Card className="mb-8">
        <Card.Body>
          <h1 className="text-3xl font-bold mb-2">{post.titlu}</h1>
          <p className="mb-4 whitespace-pre-line">{post.continut}</p>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span>Like-uri: {post.numar_like}</span>
            <span>Comentarii: {post.numar_comentarii}</span>
            <Button size="sm" onClick={handleLike}>
              {hasLiked ? "Retrage aprecierea" : "Apreciază"}
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Comentarii</h2>
        </Card.Header>
        <Card.Body>
          {post.comentarii && post.comentarii.length === 0 && (
            <p className="text-gray-600">Nu există comentarii.</p>
          )}
          {post.comentarii && post.comentarii.length > 0 && (
            <div className="space-y-4 mb-6">
              {post.comentarii.map((c) => (
                <div key={c.id_comentariu} className="border p-3 rounded-md">
                  <p className="text-sm text-gray-500 mb-1">
                     {(c.utilizator?.nume || c.User?.nume || "Utilizator necunoscut")} - {new Date(c.data_comentariu).toLocaleString("ro-RO")}
                  </p>
                  {editingId === c.id_comentariu ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdateComment(c.id_comentariu)}>
                          Salvează
                        </Button>
                        <Button variant="outline" size="sm" onClick={cancelEdit}>
                          Anulează
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="mb-2 whitespace-pre-line">{c.continut}</p>
                      {currentUser && currentUser.id === c.id_utilizator && (
                        <Button variant="outline" size="sm" onClick={() => startEdit(c)}>
                          Editează
                        </Button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
          <div>
            <Textarea
              label="Adaugă un comentariu"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button onClick={handleAddComment}>Trimite</Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default PostDetailPage;