import React, { useState } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Search, 
  Plus, 
  Filter, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  X,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronDown
} from 'lucide-react';
import { ForumPost } from '../types';

interface PublicForumProps {
  posts: ForumPost[];
  onCreatePost: (newPost: { title: string; category: string; content: string; author: string; tags: string[] }) => void;
  onUpvotePost: (postId: string) => void;
  onDownvotePost: (postId: string) => void;
  onAddComment: (postId: string, comment: { author: string; content: string }) => void;
}

export const PublicForum: React.FC<PublicForumProps> = ({
  posts,
  onCreatePost,
  onUpvotePost,
  onDownvotePost,
  onAddComment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // New post form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Reforma Política & Transparência');
  const [newContent, setNewContent] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newTags, setNewTags] = useState('');

  const categories = [
    'TODAS',
    'Reforma Política & Transparência',
    'Economia & Sistema Tributário',
    'Educação & Saúde Pública',
    'Segurança & Direitos Cívicos',
    'Eleições 2026 & Candidaturas'
  ];

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = selectedCategory === 'TODAS' || p.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    onCreatePost({
      title: newTitle.trim(),
      category: newCategory,
      content: newContent.trim(),
      author: newAuthor.trim() || 'Cidadão Participativo',
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean)
    });

    setNewTitle('');
    setNewContent('');
    setNewAuthor('');
    setNewTags('');
    setShowCreateModal(false);
  };

  const handleSendComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    onAddComment(postId, {
      author: 'Cidadão Conectado',
      content: text.trim()
    });

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <MessageSquare className="h-4 w-4" /> Fórum Cívico de Debates Públicos
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Espaço Cidadão Republicano
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Participe de discussões construtivas sobre reformas legislativas, prestação de contas, orçamento público e propostas eleitorais com moderação e civilidade.
            </p>
          </div>

          <button
            id="btn-open-create-topic"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-900/40 transition-all active:scale-95 self-start md:self-center"
          >
            <Plus className="h-4 w-4" />
            <span>Criar Novo Tópico Cívico</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mt-3 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="forum-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar nos debates cívicos..."
            className="w-full bg-slate-950 text-xs text-slate-100 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map(post => {
          const isExpanded = expandedPostId === post.id;

          return (
            <div
              key={post.id}
              id={`forum-post-${post.id}`}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition-colors"
            >
              {/* Top metadata */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-emerald-400">
                    {post.author.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{post.author}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{post.date} • {post.category}</div>
                  </div>
                </div>

                <span className="text-[10px] bg-slate-950 text-emerald-300 font-mono px-2 py-0.5 rounded border border-slate-800">
                  {post.commentsCount} respostas
                </span>
              </div>

              {/* Title & Body */}
              <div>
                <h3 className="text-base font-bold text-white leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {post.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-950 text-slate-400 px-2.5 py-0.5 rounded-md border border-slate-800">
                    #{t}
                  </span>
                ))}
              </div>

              {/* Interaction Bar */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onUpvotePost(post.id)}
                    className="flex items-center gap-1.5 bg-slate-950 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-400 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors font-bold"
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>{post.upvotes}</span>
                  </button>

                  <button
                    onClick={() => onDownvotePost(post.id)}
                    className="flex items-center gap-1.5 bg-slate-950 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 px-2.5 py-1.5 rounded-lg border border-slate-800 transition-colors"
                  >
                    <ThumbsDown className="h-3.5 w-3.5" />
                    <span>{post.downvotes}</span>
                  </button>
                </div>

                <button
                  onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>{isExpanded ? 'Ocultar Respostas' : `Ver Respostas (${post.comments.length})`}</span>
                </button>
              </div>

              {/* Expanded Comments Thread */}
              {isExpanded && (
                <div className="pt-4 border-t border-slate-800/80 space-y-3 bg-slate-950/40 p-4 rounded-xl">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Comentários da Comunidade ({post.comments.length})
                  </h4>

                  {post.comments.map(c => (
                    <div key={c.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <strong className="text-slate-200">{c.author}</strong>
                        <span>{c.date}</span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">{c.content}</p>
                    </div>
                  ))}

                  {/* Add comment input */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendComment(post.id);
                      }}
                      placeholder="Escreva um comentário construtivo..."
                      className="flex-1 bg-slate-950 text-xs text-slate-100 placeholder-slate-500 px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      onClick={() => handleSendComment(post.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl transition-colors"
                      title="Enviar comentário"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Code of Civility */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0" />
        <span>
          <strong>Diretrizes Cívicas:</strong> Mantenha o respeito mútuo e o foco no debate institucional. Conteúdos com discurso de ódio, ameaças ou desinformação deliberada são passíveis de moderação.
        </span>
      </div>

      {/* Create New Topic Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-emerald-400" /> Publicar Novo Debate Cívico
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Título do Debate</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Como a transição da Reforma Tributária impactará pequenas empresas?"
                  className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Categoria Temática</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-700 focus:outline-none"
                >
                  {categories.filter(c => c !== 'TODAS').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Seu Nome / Identificação Cívica</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Ex: Cidadão de MG, Maria Santos, etc."
                  className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Conteúdo & Argumentação</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Apresente sua perspectiva com clareza, fontes ou dúvidas..."
                  className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Ex: impostos, pme, congresso"
                  className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-700 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md"
                >
                  Publicar Debate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
