'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProfileForm from '@/components/ProfileForm';
import { syncLocalDataToFirestore, subscribeToUserStats } from '@/lib/userStats';
import { UserStats } from '@/lib/types';
import UserAvatar from './UserAvatar';
import GameStatCard from './GameStatCard';
import { FaGamepad, FaTasks, FaLanguage, FaEdit, FaSync, FaCrown, FaCalendarAlt, FaLandmark, FaQuestionCircle, FaMapMarkedAlt, FaBrain, FaMedal } from 'react-icons/fa';
import { BsFire } from 'react-icons/bs';
import BadgeDisplay from './BadgeDisplay';

export default function ProfilePageContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      // 1. Initial Sync
      const syncData = async () => {
        setIsSyncing(true);
        await syncLocalDataToFirestore(user.uid);
        setIsSyncing(false);
      };
      syncData();

      // 2. Subscribe to real-time updates
      const unsubscribe = subscribeToUserStats(user.uid, (data) => {
        setStats(data);
      });

      return () => unsubscribe();
    }
  }, [user]);

  if (!user) return null;

  // Calculate totals
  const totalLogos = stats?.logoQuiz?.score || 0;
  const vocabKnown = stats?.vocabGame?.totalKnown || 0;
  const kingsScore = stats?.kingsOfNepal?.correctAnswers?.length || 0;
  const festivalScore = stats?.guessFestival?.score || 0;
  const mandirScore = stats?.mandirChineu?.highScore || 0;
  const gauScore = stats?.gauKhaneKatha?.score || 0;
  const districtScore = stats?.nameDistricts?.correctGuesses?.length || 0;
  const gkScore = stats?.generalKnowledge?.highScore || 0;
  const firstScore = stats?.firstOfNepal?.highScore || 0;

  const totalScore = totalLogos + vocabKnown + kingsScore + festivalScore + mandirScore + gauScore + districtScore + gkScore + firstScore;

  const checklistCompleted = stats?.lifeChecklist?.completedItems?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header / User Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <UserAvatar user={user} size="xl" className="border-4 border-white shadow-lg" />
          
          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">{user.displayName || 'Traveler'}</h1>
            <p className="text-gray-500">{user.email}</p>
            
            <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-3">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                <FaEdit className="mr-2 text-gray-400" />
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>
          </div>

           {/* Aggregate Stats Mini-Cards */}
           <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <p className="text-2xl font-bold text-blue-600">{totalScore}</p>
                  <p className="text-xs text-blue-800 font-medium uppercase tracking-wide">Total Score</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl text-center">
                  <p className="text-2xl font-bold text-green-600">{checklistCompleted}</p>
                  <p className="text-xs text-green-800 font-medium uppercase tracking-wide">Achievements</p>
              </div>
           </div>
        </div>

        {/* Edit Profile Form Collapsible */}
        {isEditing && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-in fade-in slide-in-from-top-4 duration-300">
                <h2 className="text-xl font-bold mb-6">Update Your Profile</h2>
                <ProfileForm user={user} />
            </div>
        )}

        {/* Badge Display */}
        <BadgeDisplay stats={stats || { userId: user.uid, lastActive: new Date().toISOString() } as UserStats} />

        {/* Game Stats List */}
        <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <BsFire className="text-orange-500 mr-2" />
                Game Statistics
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                
                {/* Logo Quiz */}
                <div className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <FaGamepad className="text-white text-lg" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Logo Quiz</h3>
                                <p className="text-sm text-gray-500">Logos Guessed: {stats?.logoQuiz?.score || 0}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400">Last Played</p>
                            <p className="text-sm font-medium text-gray-700">{stats?.logoQuiz?.lastPlayed ? new Date(stats.logoQuiz.lastPlayed).toLocaleDateString() : 'Never'}</p>
                        </div>
                    </div>
                </div>

                {/* Vocab Game */}
                <div className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center">
                                <FaLanguage className="text-white text-lg" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Vocab Mastery</h3>
                                <p className="text-sm text-gray-500">Known: {stats?.vocabGame?.totalKnown || 0} | Learning: {stats?.vocabGame?.totalUnknown || 0}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400">Last Session</p>
                            <p className="text-sm font-medium text-gray-700">{stats?.vocabGame?.lastSessionDate ? new Date(stats.vocabGame.lastSessionDate).toLocaleDateString() : 'Never'}</p>
                        </div>
                    </div>
                </div>

                {/* Life Checklist */}
                <div className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                                <FaTasks className="text-white text-lg" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Nepal Life Checklist</h3>
                                <p className="text-sm text-gray-500">Completed: {checklistCompleted}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400">Last Updated</p>
                            <p className="text-sm font-medium text-gray-700">{stats?.lifeChecklist?.lastUpdated ? new Date(stats.lifeChecklist.lastUpdated).toLocaleDateString() : 'Never'}</p>
                        </div>
                    </div>
                </div>

                {/* Kings of Nepal */}
                <div className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                                <FaCrown className="text-white text-lg" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Kings of Nepal</h3>
                                <p className="text-sm text-gray-500">Correct Answers: {stats?.kingsOfNepal?.correctAnswers?.length || 0}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400">Last Played</p>
                            <p className="text-sm font-medium text-gray-700">{stats?.kingsOfNepal?.lastPlayed ? new Date(stats.kingsOfNepal.lastPlayed).toLocaleDateString() : 'Never'}</p>
                        </div>
                    </div>
                </div>

                {/* Guess Festival */}
                <div className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-600 rounded-lg flex items-center justify-center">
                                <FaCalendarAlt className="text-white text-lg" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Guess Festival</h3>
                                <p className="text-sm text-gray-500">Best Streak: {stats?.guessFestival?.bestStreak || 0} | Score: {stats?.guessFestival?.score || 0}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400">Last Played</p>
                            <p className="text-sm font-medium text-gray-700">{stats?.guessFestival?.lastPlayed ? new Date(stats.guessFestival.lastPlayed).toLocaleDateString() : 'Never'}</p>
                        </div>
                    </div>
                </div>

                {/* Guess The Temple */}
                <div className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center">
                                <FaLandmark className="text-white text-lg" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Guess The Temple</h3>
                                <p className="text-sm text-gray-500">High Score: {stats?.mandirChineu?.highScore || 0} | Rounds: {stats?.mandirChineu?.completedRounds || 0}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400">Last Played</p>
                            <p className="text-sm font-medium text-gray-700">{stats?.mandirChineu?.lastPlayed ? new Date(stats.mandirChineu.lastPlayed).toLocaleDateString() : 'Never'}</p>
                        </div>
                    </div>
                </div>

                {/* Gau Khane Katha */}
                <div className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-lg flex items-center justify-center">
                                <FaQuestionCircle className="text-white text-lg" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Gau Khane Katha</h3>
                                <p className="text-sm text-gray-500">Solved: {stats?.gauKhaneKatha?.answeredRiddles?.length || 0} | Best Streak: {stats?.gauKhaneKatha?.bestStreak || 0}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400">Last Played</p>
                            <p className="text-sm font-medium text-gray-700">{stats?.gauKhaneKatha?.lastPlayed ? new Date(stats.gauKhaneKatha.lastPlayed).toLocaleDateString() : 'Never'}</p>
                        </div>
                    </div>
                </div>

                {/* Name Districts */}
                <div className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                                <FaMapMarkedAlt className="text-white text-lg" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Name Districts</h3>
                                <p className="text-sm text-gray-500">Named: {stats?.nameDistricts?.correctGuesses?.length || 0} | Best Streak: {stats?.nameDistricts?.bestStreak || 0}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400">Last Played</p>
                            <p className="text-sm font-medium text-gray-700">{stats?.nameDistricts?.lastPlayed ? new Date(stats.nameDistricts.lastPlayed).toLocaleDateString() : 'Never'}</p>
                        </div>
                    </div>
                </div>

                {/* General Knowledge */}
                <div className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-lg flex items-center justify-center">
                                <FaBrain className="text-white text-lg" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">General Knowledge</h3>
                                <p className="text-sm text-gray-500">High Score: {stats?.generalKnowledge?.highScore || 0} | Games: {stats?.generalKnowledge?.totalGamesPlayed || 0}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400">Last Played</p>
                            <p className="text-sm font-medium text-gray-700">{stats?.generalKnowledge?.lastPlayed ? new Date(stats.generalKnowledge.lastPlayed).toLocaleDateString() : 'Never'}</p>
                        </div>
                    </div>
                </div>

                {/* First of Nepal */}
                <div className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-600 rounded-lg flex items-center justify-center">
                                <FaMedal className="text-white text-lg" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">First of Nepal</h3>
                                <p className="text-sm text-gray-500">High Score: {stats?.firstOfNepal?.highScore || 0} | Quizzes: {stats?.firstOfNepal?.quizzesCompleted || 0}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400">Last Played</p>
                            <p className="text-sm font-medium text-gray-700">{stats?.firstOfNepal?.lastPlayed ? new Date(stats.firstOfNepal.lastPlayed).toLocaleDateString() : 'Never'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
