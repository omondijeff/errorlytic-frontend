import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Calendar, MapPin, Star, Trophy, Car, Wrench } from 'lucide-react';

const Community: React.FC = () => {
  const communityStats = [
    { label: 'Active Members', value: '150+', icon: Users, color: 'from-blue-500 to-blue-700' },
    { label: 'Garages', value: '25+', icon: Wrench, color: 'from-green-500 to-green-700' },
    { label: 'VAG Models', value: '50+', icon: Car, color: 'from-red-500 to-red-700' },
    { label: 'Events Hosted', value: '12', icon: Calendar, color: 'from-purple-500 to-purple-700' }
  ];

  const upcomingEvents = [
    { 
      title: 'VAG Culture Meet & Greet', 
      date: '2025-09-15', 
      location: 'Nairobi', 
      attendees: 45,
      type: 'meetup'
    },
    { 
      title: 'VCDS Training Workshop', 
      date: '2025-09-22', 
      location: 'Mombasa', 
      attendees: 30,
      type: 'workshop'
    },
    { 
      title: 'VAG Show & Shine', 
      date: '2025-10-05', 
      location: 'Kisumu', 
      attendees: 80,
      type: 'show'
    }
  ];

  const topMembers = [
    { name: 'John Kamau', role: 'Master Mechanic', garage: 'Kamau Auto', rating: 5, speciality: 'Audi' },
    { name: 'Sarah Wanjiku', role: 'VAG Specialist', garage: 'Wanjiku Motors', rating: 5, speciality: 'Volkswagen' },
    { name: 'Mike Ochieng', role: 'Porsche Expert', garage: 'Ochieng Performance', rating: 5, speciality: 'Porsche' }
  ];

  return (
    <div className="min-h-screen pt-16" style={{ 
      background: 'linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>VAG Culture Community</h1>
          <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>
            Connect with fellow VAG enthusiasts, mechanics, and garage owners across Kenya.
          </p>
          
          {/* Community Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6" style={{ 
            background: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid rgba(220, 38, 38, 0.3)'
          }}>
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-primary)' }}></span>
            <span className="text-sm font-medium" style={{ color: 'var(--accent-primary)' }}>
              Exclusive Community Access
            </span>
          </div>
        </motion.div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {communityStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                <div style={{ color: 'var(--text-tertiary)' }}>{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Upcoming Community Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="p-6 rounded-lg"
                  style={{ background: 'var(--bg-secondary)' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.type === 'meetup' ? 'bg-blue-500/20 text-blue-400' :
                      event.type === 'workshop' ? 'bg-green-500/20 text-green-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {event.type}
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                      {event.attendees} attending
                    </span>
                  </div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{event.title}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{event.location}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Top Members */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Community Leaders</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="text-center p-6 rounded-lg"
                  style={{ background: 'var(--bg-secondary)' }}
                >
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ 
                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                  }}>
                    <span className="text-2xl font-bold text-white">{member.name.charAt(0)}</span>
                  </div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{member.name}</h3>
                  <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{member.role}</p>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-tertiary)' }}>{member.garage}</p>
                  <div className="flex items-center justify-center space-x-1 mb-3">
                    {[...Array(member.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ 
                    background: 'rgba(220, 38, 38, 0.1)',
                    color: 'var(--accent-primary)',
                    border: '1px solid rgba(220, 38, 38, 0.3)'
                  }}>
                    {member.speciality} Specialist
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Community;
