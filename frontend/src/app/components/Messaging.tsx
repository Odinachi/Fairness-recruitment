import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { Layout } from './Layout'
import {
  Send, Search, Paperclip, Smile, MoreVertical, Phone, Video,
  Circle, ArrowLeft, Sparkles, Brain, Zap,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export function Messaging() {
  const { user, conversations, messages, addMessage, updateConversationLastMessage } = useApp()
  const [activeConvId, setActiveConvId] = useState<string | null>('1')
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [showAI, setShowAI] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeConv = conversations.find(c => c.id === activeConvId)
  const currentMessages = activeConvId ? (messages[activeConvId] || []) : []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !activeConvId) return

    const newMsg = {
      id: Date.now().toString(),
      conversationId: activeConvId,
      senderId: 'user',
      senderName: user?.name || 'You',
      senderAvatar: user?.avatar || '',
      content: input.trim(),
      timestamp: new Date().toISOString(),
      read: true,
    }

    setInput('')
    await addMessage(newMsg)
    await updateConversationLastMessage(activeConvId, newMsg.content, 'Just now')

    // Simulate reply
    if (activeConvId === '1') {
      setTimeout(async () => {
        const reply = {
          id: (Date.now() + 1).toString(),
          conversationId: activeConvId,
          senderId: 'recruiter',
          senderName: activeConv?.participantName || 'Recruiter',
          senderAvatar: activeConv?.participantAvatar || '',
          content: 'Thanks for your message! Let me check my calendar and get back to you shortly.',
          timestamp: new Date().toISOString(),
          read: false,
        }
        await addMessage(reply)
        await updateConversationLastMessage(activeConvId, reply.content, 'Just now')
      }, 1500)
    }
  }

  const aiSuggestions = [
    'Tuesday at 2 PM works great for me!',
    'Looking forward to discussing the role in more detail.',
    'Could you share more information about the team culture?',
  ]

  const filteredConversations = conversations.filter(c =>
    c.participantName.toLowerCase().includes(search.toLowerCase()) ||
    c.participantTitle.toLowerCase().includes(search.toLowerCase())
  )

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Layout>
      <div className="flex h-[calc(100vh-57px)]">
        {/* Conversations sidebar */}
        <div className={`${activeConvId ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r border-border bg-card`}>
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold mb-3">Messages</h2>
            <div className="relative">
              <Search size={15} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-muted border border-border focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`w-full flex items-start gap-3 p-4 hover:bg-muted/40 transition-colors text-left border-b border-border ${
                  activeConvId === conv.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img src={conv.participantAvatar} alt={conv.participantName} className="w-10 h-10 rounded-full object-cover" />
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-medium truncate">{conv.participantName}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{conv.lastMessageTime}</span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{conv.participantTitle}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground truncate">{conv.lastMessage}</span>
                    {conv.unread > 0 && (
                      <span className="flex-shrink-0 ml-2 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat window */}
        {activeConvId && activeConv ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
              <button
                onClick={() => setActiveConvId(null)}
                className="md:hidden w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground group"
              >
                <ArrowLeft size={18} strokeWidth={1.75} className="transition-transform group-hover:-translate-x-0.5" />
              </button>
              <div className="relative">
                <img src={activeConv.participantAvatar} alt={activeConv.participantName} className="w-9 h-9 rounded-full object-cover" />
                {activeConv.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-card" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{activeConv.participantName}</div>
                <div className="text-xs text-muted-foreground">{activeConv.participantTitle}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAI(!showAI)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 group/ai ${
                    showAI ? 'bg-primary/20 text-primary border border-primary/30 shadow-sm' : 'border border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Sparkles size={12} strokeWidth={1.75} fill="currentColor" fillOpacity={showAI ? 0.2 : 0} className="animate-pulse" /> AI Assist
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all group/phone">
                  <Phone size={16} strokeWidth={1.75} className="transition-transform duration-200 group-hover/phone:scale-110" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all group/video">
                  <Video size={16} strokeWidth={1.75} className="transition-transform duration-200 group-hover/video:scale-110" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-muted rounded-lg transition-all group/more">
                  <MoreVertical size={16} strokeWidth={1.75} className="transition-transform duration-200 group-hover/more:scale-110" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMessages.map((msg, i) => {
                const isUser = msg.senderId === 'user'
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {!isUser && (
                      <img src={msg.senderAvatar} alt={msg.senderName} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                    )}
                    <div className={`max-w-xs lg:max-w-md`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isUser
                          ? 'bg-primary text-white rounded-br-md'
                          : 'bg-card border border-border rounded-bl-md'
                      }`}>
                        {msg.content}
                      </div>
                      <div className={`text-xs text-muted-foreground mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* AI Suggestions */}
            <AnimatePresence>
              {showAI && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 py-3 border-t border-border bg-primary/5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Brain size={13} strokeWidth={1.75} fill="currentColor" fillOpacity={0.15} className="text-primary animate-pulse" />
                    <span className="text-xs font-medium text-primary">AI Suggested Replies</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {aiSuggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setInput(s)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-card border border-border hover:border-primary/30 hover:bg-primary/5 transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <form onSubmit={sendMessage} className="flex items-center gap-3 p-4 border-t border-border bg-card">
              <button type="button" className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all group/clip">
                <Paperclip size={18} strokeWidth={1.75} className="transition-transform duration-200 group-hover/clip:scale-115 group-hover/clip:rotate-12" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-muted-foreground transition-all"
                />
              </div>
              <button type="button" className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all group/smile">
                <Smile size={18} strokeWidth={1.75} fill="currentColor" fillOpacity={0.15} className="transition-transform duration-200 group-hover/smile:scale-115" />
              </button>
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 transition-all shadow-sm shadow-primary/30 group/send hover:scale-105 active:scale-95"
              >
                <Send size={16} strokeWidth={1.75} className="transition-transform duration-300 group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5 group-hover/send:scale-105" />
              </button>
            </form>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-muted/10 group">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <Zap size={28} strokeWidth={1.75} fill="currentColor" fillOpacity={0.15} className="text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              </div>
              <h3 className="font-semibold mb-2">Select a conversation</h3>
              <p className="text-sm text-muted-foreground">Choose a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
