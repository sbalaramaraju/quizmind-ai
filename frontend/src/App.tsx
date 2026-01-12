
import React, { useState, useEffect } from 'react';
import { Home } from '../views/Home';
import { CreateQuiz } from '../views/CreateQuiz';
import { JoinRoom } from '../views/JoinRoom';
import { Lobby } from '../views/Lobby';
import { QuizPlay } from '../views/QuizPlay';
import { HostLiveView } from '../views/HostLiveView';
import { Leaderboard } from '../views/Leaderboard';
import { QuizRoom, Player } from './types';
import { socket } from './socket';

type View = 'home' | 'create' | 'join' | 'lobby' | 'play' | 'leaderboard';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [activeRoom, setActiveRoom] = useState<QuizRoom | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  useEffect(() => {
    socket.on('room_update', (room: QuizRoom) => {
      setActiveRoom(room);
      if (room.status === 'active' && (currentView === 'lobby' || currentView === 'home')) {
        setCurrentView('play');
      }
      if (room.status === 'completed') {
        setCurrentView('leaderboard');
      }
    });

    return () => {
      socket.off('room_update');
    };
  }, [currentView]);

  const handleRoomCreated = (room: QuizRoom, player: Player) => {
    setActiveRoom(room);
    setCurrentPlayer(player);
    setCurrentView('lobby');
  };

  const handleRoomJoined = (room: QuizRoom, player: Player) => {
    setActiveRoom(room);
    setCurrentPlayer(player);
    if (room.status === 'active') setCurrentView('play');
    else if (room.status === 'completed') setCurrentView('leaderboard');
    else setCurrentView('lobby');
  };

  const handleBackToHome = () => {
    setActiveRoom(null);
    setCurrentPlayer(null);
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {currentView === 'home' && (
          <Home onCreate={() => setCurrentView('create')} onJoin={() => setCurrentView('join')} />
        )}
        {currentView === 'create' && (
          <CreateQuiz onCreated={handleRoomCreated} onBack={handleBackToHome} />
        )}
        {currentView === 'join' && (
          <JoinRoom onJoined={handleRoomJoined} onBack={handleBackToHome} />
        )}
        {currentView === 'lobby' && activeRoom && currentPlayer && (
          <Lobby room={activeRoom} player={currentPlayer} onStart={() => socket.emit('start_quiz', activeRoom.id)} />
        )}
        {currentView === 'play' && activeRoom && currentPlayer && (
          currentPlayer.isHost 
            ? <HostLiveView room={activeRoom} /> 
            : <QuizPlay room={activeRoom} player={currentPlayer} />
        )}
        {currentView === 'leaderboard' && activeRoom && (
          <Leaderboard room={activeRoom} onBack={handleBackToHome} />
        )}
      </div>
    </div>
  );
};

export default App;
