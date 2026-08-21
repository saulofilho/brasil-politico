import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BrazilMap } from './components/BrazilMap';
import { PoliticiansDirectory } from './components/PoliticiansDirectory';
import { PartiesDirectory } from './components/PartiesDirectory';
import { IntegrityWatchdog } from './components/IntegrityWatchdog';
import { FactCheckingCenter } from './components/FactCheckingCenter';
import { LegislationTracker } from './components/LegislationTracker';
import { PublicForum } from './components/PublicForum';
import { ElectionsHub } from './components/ElectionsHub';
import { CivicAssistantModal } from './components/CivicAssistantModal';

import { 
  POLITICIANS_DATA, 
  PARTIES_DATA, 
  BRAZIL_STATES_DATA, 
  LEGISLATION_DATA, 
  NOTIFICATIONS_DATA, 
  FORUM_POSTS_DATA 
} from './data/politicalData';
import { Politician, Party, StateData, Legislation, NotificationItem, ForumPost } from './types';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('mapa');

  // Entities Data State with persistence
  const [politicians] = useState<Politician[]>(POLITICIANS_DATA);
  const [parties] = useState<Party[]>(PARTIES_DATA);
  const [states] = useState<StateData[]>(BRAZIL_STATES_DATA);
  
  const [laws, setLaws] = useState<Legislation[]>(() => {
    const saved = localStorage.getItem('bp_laws_votes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return LEGISLATION_DATA.map(l => ({
          ...l,
          popularVotesPro: parsed[l.id]?.pro ?? l.popularVotesPro,
          popularVotesAgainst: parsed[l.id]?.against ?? l.popularVotesAgainst
        }));
      } catch (e) {
        return LEGISLATION_DATA;
      }
    }
    return LEGISLATION_DATA;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('bp_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return NOTIFICATIONS_DATA; }
    }
    return NOTIFICATIONS_DATA;
  });

  const [forumPosts, setForumPosts] = useState<ForumPost[]>(() => {
    const saved = localStorage.getItem('bp_forum_posts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return FORUM_POSTS_DATA; }
    }
    return FORUM_POSTS_DATA;
  });

  const [userVotes, setUserVotes] = useState<Record<string, 'pro' | 'against'>>(() => {
    const saved = localStorage.getItem('bp_user_votes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return {}; }
    }
    return {};
  });

  const [subscribedLaws, setSubscribedLaws] = useState<string[]>(() => {
    const saved = localStorage.getItem('bp_subscribed_laws');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return ['pl-2630']; }
    }
    return ['pl-2630'];
  });

  // Selected Entities for Inspecting/Filtering
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [selectedPolitician, setSelectedPolitician] = useState<Politician | null>(null);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [selectedLaw, setSelectedLaw] = useState<Legislation | null>(null);
  const [candidateToCompare, setCandidateToCompare] = useState<Politician | null>(null);
  const [filterStateUf, setFilterStateUf] = useState<string>('TODOS');

  // AI Civic Assistant Modal State
  const [isCivicChatOpen, setIsCivicChatOpen] = useState(false);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('bp_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('bp_forum_posts', JSON.stringify(forumPosts));
  }, [forumPosts]);

  useEffect(() => {
    localStorage.setItem('bp_user_votes', JSON.stringify(userVotes));
  }, [userVotes]);

  useEffect(() => {
    localStorage.setItem('bp_subscribed_laws', JSON.stringify(subscribedLaws));
  }, [subscribedLaws]);

  // Handlers
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleVoteLaw = (lawId: string, type: 'pro' | 'against') => {
    const previousVote = userVotes[lawId];
    if (previousVote === type) return; // already voted this

    setUserVotes(prev => ({ ...prev, [lawId]: type }));

    setLaws(prev => prev.map(l => {
      if (l.id === lawId) {
        let newPro = l.popularVotesPro;
        let newAgainst = l.popularVotesAgainst;

        if (previousVote === 'pro') newPro = Math.max(0, newPro - 1);
        if (previousVote === 'against') newAgainst = Math.max(0, newAgainst - 1);

        if (type === 'pro') newPro += 1;
        if (type === 'against') newAgainst += 1;

        return { ...l, popularVotesPro: newPro, popularVotesAgainst: newAgainst };
      }
      return l;
    }));
  };

  const handleToggleSubscription = (lawId: string) => {
    setSubscribedLaws(prev => {
      const isSub = prev.includes(lawId);
      const updated = isSub ? prev.filter(id => id !== lawId) : [...prev, lawId];
      return updated;
    });
  };

  const handleCreateForumPost = (newPostData: { title: string; category: string; content: string; author: string; tags: string[] }) => {
    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      title: newPostData.title,
      category: newPostData.category,
      content: newPostData.content,
      author: newPostData.author,
      date: 'Agora',
      upvotes: 1,
      downvotes: 0,
      commentsCount: 0,
      tags: newPostData.tags,
      comments: []
    };
    setForumPosts(prev => [newPost, ...prev]);
  };

  const handleUpvotePost = (postId: string) => {
    setForumPosts(prev => prev.map(p => p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p));
  };

  const handleDownvotePost = (postId: string) => {
    setForumPosts(prev => prev.map(p => p.id === postId ? { ...p, downvotes: p.downvotes + 1 } : p));
  };

  const handleAddComment = (postId: string, comment: { author: string; content: string }) => {
    setForumPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [
            ...p.comments,
            {
              id: `comment-${Date.now()}`,
              author: comment.author,
              content: comment.content,
              date: 'Agora',
              upvotes: 0
            }
          ]
        };
      }
      return p;
    }));
  };

  const handleViewPoliticiansOfState = (uf: string) => {
    setFilterStateUf(uf);
    setActiveTab('politicos');
  };

  const handleCompareWith = (politician: Politician) => {
    setCandidateToCompare(politician);
    setActiveTab('eleicoes');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'politicos') setFilterStateUf('TODOS');
        }}
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onOpenCivicChat={() => setIsCivicChatOpen(true)}
        allPoliticians={politicians}
        allParties={parties}
        allStates={states}
        allLaws={laws}
        onSelectPolitician={(p) => {
          setSelectedPolitician(p);
          setActiveTab('politicos');
        }}
        onSelectParty={(party) => {
          setSelectedParty(party);
          setActiveTab('partidos');
        }}
        onSelectState={(st) => {
          setSelectedState(st);
          setActiveTab('mapa');
        }}
        onSelectLaw={(law) => {
          setSelectedLaw(law);
          setActiveTab('leis');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: MAPA & ESTADOS */}
        {activeTab === 'mapa' && (
          <BrazilMap
            states={states}
            selectedState={selectedState}
            onSelectState={setSelectedState}
            onViewPoliticiansOfState={handleViewPoliticiansOfState}
            politicians={politicians}
          />
        )}

        {/* TAB 2: POLÍTICOS */}
        {activeTab === 'politicos' && (
          <PoliticiansDirectory
            politicians={politicians}
            parties={parties}
            selectedPolitician={selectedPolitician}
            onSelectPolitician={setSelectedPolitician}
            onCompareWith={handleCompareWith}
            filterState={filterStateUf !== 'TODOS' ? filterStateUf : undefined}
          />
        )}

        {/* TAB 3: PARTIDOS */}
        {activeTab === 'partidos' && (
          <PartiesDirectory
            parties={parties}
            politicians={politicians}
            selectedParty={selectedParty}
            onSelectParty={setSelectedParty}
            onViewPolitician={(p) => {
              setSelectedPolitician(p);
              setActiveTab('politicos');
            }}
          />
        )}

        {/* TAB 4: INTEGRIDADE & PROCESSOS JUDICIAIS */}
        {activeTab === 'integridade' && (
          <IntegrityWatchdog
            politicians={politicians}
            onViewPolitician={(p) => {
              setSelectedPolitician(p);
              setActiveTab('politicos');
            }}
          />
        )}

        {/* TAB 5: COMBATE A FAKE NEWS */}
        {activeTab === 'fakenews' && (
          <FactCheckingCenter />
        )}

        {/* TAB 6: LEIS & CONSULTAS POPULARES */}
        {activeTab === 'leis' && (
          <LegislationTracker
            laws={laws}
            selectedLaw={selectedLaw}
            onSelectLaw={setSelectedLaw}
            onVoteLaw={handleVoteLaw}
            userVotes={userVotes}
            subscribedLaws={subscribedLaws}
            onToggleSubscription={handleToggleSubscription}
          />
        )}

        {/* TAB 7: ELEIÇÕES & SIMULADOR */}
        {activeTab === 'eleicoes' && (
          <ElectionsHub
            politicians={politicians}
            parties={parties}
            initialCandidateToCompare={candidateToCompare}
          />
        )}

        {/* TAB 8: FÓRUM CÍVICO */}
        {activeTab === 'forum' && (
          <PublicForum
            posts={forumPosts}
            onCreatePost={handleCreateForumPost}
            onUpvotePost={handleUpvotePost}
            onDownvotePost={handleDownvotePost}
            onAddComment={handleAddComment}
          />
        )}

      </main>

      {/* Floating AI Civic Assistant Modal */}
      <CivicAssistantModal
        isOpen={isCivicChatOpen}
        onClose={() => setIsCivicChatOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Brasil Político</span>
            <span>— Plataforma Cívica e Aberta de Transparência</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Fontes: TSE, STF, Câmara, Senado e TCU</span>
            <span>•</span>
            <span className="text-emerald-400">Compatível com Node &gt;= 20 e GitHub Pages</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
