'use client';

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UserProfile {
  name: string;
  email: string;
  image?: string;
  bio?: string;
  location?: string;
  phone?: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.user) {
      fetchProfile();
    }
  }, [session, status, router]);

  const fetchProfile = async () => {
    const response = await fetch('/api/users/profile');
    if (response.ok) {
      const data = await response.json();
      setProfile(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedProfile = {
      name: formData.get('name'),
      email: formData.get('email'),
      bio: formData.get('bio'),
      location: formData.get('location'),
      phone: formData.get('phone'),
    };

    const response = await fetch('/api/users/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProfile),
    });

    if (response.ok) {
      setProfile(await response.json());
      setIsEditing(false);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">Profile Settings</h1>
        
        {profile && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            {!isEditing ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <img
                    src={profile.image || "https://via.placeholder.com/100"}
                    alt={profile.name}
                    className="w-20 h-20 rounded-full"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{profile.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
                  </div>
                </div>
                
                {profile.bio && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Bio</h3>
                    <p className="mt-1 text-gray-800 dark:text-gray-200">{profile.bio}</p>
                  </div>
                )}
                
                {profile.location && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h3>
                    <p className="mt-1 text-gray-800 dark:text-gray-200">{profile.location}</p>
                  </div>
                )}
                
                {profile.phone && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h3>
                    <p className="mt-1 text-gray-800 dark:text-gray-200">{profile.phone}</p>
                  </div>
                )}
                
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={profile.name}
                    className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={profile.email}
                    className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                  <textarea
                    name="bio"
                    defaultValue={profile.bio}
                    className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={profile.location}
                    className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={profile.phone}
                    className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 