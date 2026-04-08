import React from 'react';
import { 
  HelpCircle, 
  Book, 
  MessageSquare, 
  Video, 
  FileText, 
  ExternalLink, 
  Search,
  ChevronRight,
  LifeBuoy,
  Mail,
  Phone
} from 'lucide-react';
import { cn } from '../lib/utils';

export function Help() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold">How can we help you?</h1>
        <p className="text-brand-400">Search our knowledge base or get in touch with our support team.</p>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-500 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search for articles, guides, and more..." 
            className="w-full bg-brand-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-lg focus:outline-none focus:border-blue-500/50 transition-all shadow-xl"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Book, title: 'Documentation', desc: 'Detailed guides on every feature.', color: 'text-blue-400' },
          { icon: Video, title: 'Video Tutorials', desc: 'Watch and learn how to use OmniCore.', color: 'text-emerald-400' },
          { icon: MessageSquare, title: 'Community Forum', desc: 'Join the discussion with other users.', color: 'text-purple-400' },
        ].map((item, i) => (
          <button key={i} className="glass-card p-6 text-left hover:border-blue-500/30 transition-all group">
            <div className={cn("p-3 rounded-xl bg-white/5 mb-4 inline-block", item.color)}>
              <item.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold group-hover:text-blue-400 transition-colors">{item.title}</h3>
            <p className="text-sm text-brand-500 mt-2">{item.desc}</p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Learn More <ChevronRight className="w-3 h-3" />
            </div>
          </button>
        ))}
      </div>

      {/* Popular Articles */}
      <div className="glass-card p-8">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          Popular Articles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'Setting up your first marketplace sync',
            'How to manage multi-channel inventory',
            'Understanding POS terminal offline mode',
            'Configuring role-based access control',
            'Generating advanced financial reports',
            'Connecting your WooCommerce store',
          ].map((article, i) => (
            <button key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group">
              <span className="text-sm font-medium text-brand-300 group-hover:text-white transition-colors">{article}</span>
              <ExternalLink className="w-4 h-4 text-brand-500 group-hover:text-blue-400 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Support Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8 bg-blue-600/5 border-blue-500/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Direct Support</h3>
              <p className="text-xs text-brand-400">Our team is available 24/7 for urgent issues.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-brand-950/50 border border-white/5">
              <Mail className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-[10px] text-brand-500 uppercase tracking-widest font-bold">Email Us</p>
                <p className="text-sm font-bold">support@omnicore.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-brand-950/50 border border-white/5">
              <Phone className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-[10px] text-brand-500 uppercase tracking-widest font-bold">Call Us</p>
                <p className="text-sm font-bold">+92 300 1234567</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-8 bg-purple-600/5 border-purple-500/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Live Chat</h3>
              <p className="text-xs text-brand-400">Average response time: 2 minutes.</p>
            </div>
          </div>
          <p className="text-sm text-brand-400 mb-6">Need immediate assistance? Start a live chat with one of our support specialists right now.</p>
          <button className="w-full bg-purple-600 hover:bg-purple-500 px-6 py-4 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-purple-500/20">
            Start Live Chat
          </button>
        </div>
      </div>
    </div>
  );
}
