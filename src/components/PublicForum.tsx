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
    const authorStr = p.author || p.authorName || '';
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      authorStr.toLowerCase().includes(searchTerm.toLowerCase());

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
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-700 text-[10px] font-bold uppercase tracking-widest mb-0.5">
              <MessageSquare className="h-3.5 w-3.5" /> Fórum Cívico de Debates Públicos
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Espaço Cidadão Republicano
            </h2>
            <p className="text-slate-500 text-xs mt-0.5 max-w-2xl leading-relaxed">
              Participe de discussões construtivas sobre reformas legislativas, prestação de contas, orçamento público e propostas eleitorais com civilidade.
            </p>
          </div>

          <button
            id="btn-open-create-topic"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-xs transition-all cursor-pointer self-start md:self-center"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Novo Tópico Cívico</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="mt-3 flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white font-bold shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mt-2.5 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            id="forum-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar nos debates cívicos..."
            className="w-full bg-slate-50 text-xs text-slate-900 placeholder-slate-400 pl-8.5 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-2.5">
        {filteredPosts.map(post => {
          const isExpanded = expandedPostId === post.id;

          return (
            <div
              key={post.id}
              id={`forum-post-${post.id}`}
              className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-xs space-y-2.5 hover:border-slate-300 transition-colors"
            >
              {/* Top metadata */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center font-bold text-[10px] text-emerald-800">
                    {(post.author || post.authorName || 'CI').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{post.author || post.authorName || 'Cidadão'}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{post.date || post.createdAt || 'Recente'} • {post.category}</div>
                  </div>
                </div>

                <span className="text-[10px] bg-slate-50 text-emerald-800 font-mono px-2 py-0.5 rounded border border-slate-200">
                  {post.commentsCount} respostas
                </span>
              </div>

              {/* Title & Body */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1 flex-wrap">
                {post.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                    #{t}
                  </span>
                ))}
              </div>

              {/* Interaction Bar */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpvotePost(post.id)}
                    className="flex items-center gap-1 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 px-2.5 py-1 rounded border border-slate-200 transition-colors font-bold text-xs cursor-pointer"
                  >
                    <ThumbsUp className="h-3 w-3" />
                    <span>{post.upvotes}</span>
                  </button>

                  <button
                    onClick={() => onDownvotePost(post.id)}
                    className="flex items-center gap-1 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-800 px-2 py-1 rounded border border-slate-200 transition-colors text-xs cursor-pointer"
                  >
                    <ThumbsDown className="h-3 w-3" />
                    <span>{post.downvotes}</span>
                  </button>
                </div>

                <button
                  onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                  className="flex items-center gap-1 text-emerald-800 hover:text-emerald-900 font-bold text-xs cursor-pointer"
                >
                  <MessageSquare className="h-3 w-3" />
                  <span>{isExpanded ? 'Ocultar Respostas' : `Respostas (${post.comments.length})`}</span>
                </button>
              </div>

              {/* Expanded Comments Thread */}
              {isExpanded && (
                <div className="pt-2.5 border-t border-slate-200 space-y-2 bg-slate-50 p-3 rounded-lg">
                  <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Comentários da Comunidade ({post.comments.length})
                  </h4>

                  {post.comments.map(c => (
                    <div key={c.id} className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-0.5 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <strong className="text-slate-800">{c.author}</strong>
                        <span>{c.date}</span>
                      </div>
                      <p className="text-slate-700 text-xs leading-relaxed">{c.content}</p>
                    </div>
                  ))}

                  {/* Add comment input */}
                  <div className="flex items-center gap-1.5 pt-1.5">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendComment(post.id);
                      }}
                      placeholder="Escreva um comentário construtivo..."
                      className="flex-1 bg-white text-xs text-slate-900 placeholder-slate-400 px-2.5 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                    <button
                      onClick={() => handleSendComment(post.id)}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white p-1.5 rounded-md transition-colors cursor-pointer"
                      title="Enviar comentário"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Code of Civility */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-600 flex items-center gap-2.5 shadow-xs">
        <ShieldCheck className="h-4 w-4 text-emerald-700 flex-shrink-0" />
        <span className="text-[11px] leading-relaxed">
          <strong>Diretrizes Cívicas:</strong> Mantenha o respeito mútuo e o foco no debate institucional. Conteúdos com discurso de ódio, ameaças ou desinformação deliberada são passíveis de moderação.
        </span>
      </div>

      {/* Create New Topic Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded-xl max-w-md w-full shadow-xl overflow-hidden animate-in fade-in duration-150">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5 text-emerald-700" /> Publicar Novo Debate Cívico
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-md text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1 text-[11px]">Título do Debate</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Como a transição da Reforma Tributária impactará pequenas empresas?"
                  className="w-full bg-slate-50 text-xs text-slate-900 p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 text-[11px]">Categoria Temática</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-50 text-xs text-slate-900 p-2 rounded-lg border border-slate-200 focus:outline-none"
                >
                  {categories.filter(c => c !== 'TODAS').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 text-[11px]">Seu Nome / Identificação Cívica</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Ex: Cidadão de MG, Maria Santos, etc."
                  className="w-full bg-slate-50 text-xs text-slate-900 p-2 rounded-lg border border-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 text-[11px]">Conteúdo & Argumentação</label>
                <textarea
                  required
                  rows={3}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Apresente sua perspectiva com clareza, fontes ou dúvidas..."
                  className="w-full bg-slate-50 text-xs text-slate-900 p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 text-[11px]">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Ex: impostos, pme, congresso"
                  className="w-full bg-slate-50 text-xs text-slate-900 p-2 rounded-lg border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="pt-2.5 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all shadow-xs cursor-pointer"
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
