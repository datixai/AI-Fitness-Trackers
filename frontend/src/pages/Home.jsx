// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { Activity, TrendingUp, Users, Zap, BarChart3, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-light to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container-main flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Activity className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-primary">AM CULTURISMO</h1>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                  className="btn btn-primary"
                >
                  {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-primary hover:text-secondary transition">
                  Client Login
                </Link>
                <Link to="/admin" className="text-gray-600 hover:text-dark transition">
                  Admin Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container-main max-w-4xl text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-dark mb-6">
            Your Personal Fitness <span className="text-primary">Coaching</span> Platform
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track your progress, manage your workouts, log your nutrition, and achieve your fitness goals
            with professional guidance and detailed analytics.
          </p>

          {!isAuthenticated && (
            <div className="flex gap-4 justify-center">
              <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
                Start Your Journey
              </Link>
              <a href="#features" className="btn btn-secondary text-lg px-8 py-3">
                Learn More
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 px-4">
        <div className="container-main">
          <h3 className="text-4xl font-bold text-center text-dark mb-16">
            Everything You Need to Succeed
          </h3>

          <div className="grid-responsive">
            {/* Feature 1 */}
            <div className="card">
              <div className="flex items-center justify-center w-12 h-12 bg-primary bg-opacity-10 rounded-lg mb-4">
                <BarChart3 className="text-primary" size={24} />
              </div>
              <h4 className="text-xl font-bold text-dark mb-2">Progress Analytics</h4>
              <p className="text-gray-600">
                Track weight, body fat percentage, measurements, and mood with beautiful charts and insights.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card">
              <div className="flex items-center justify-center w-12 h-12 bg-primary bg-opacity-10 rounded-lg mb-4">
                <Activity className="text-primary" size={24} />
              </div>
              <h4 className="text-xl font-bold text-dark mb-2">Workout Plans</h4>
              <p className="text-gray-600">
                Get personalized workout programs with detailed exercises, sets, reps, and intensity techniques.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card">
              <div className="flex items-center justify-center w-12 h-12 bg-primary bg-opacity-10 rounded-lg mb-4">
                <Zap className="text-primary" size={24} />
              </div>
              <h4 className="text-xl font-bold text-dark mb-2">Nutrition Tracking</h4>
              <p className="text-gray-600">
                Log meals with 8000+ foods in our database. Track calories, macros, and get meal plans.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card">
              <div className="flex items-center justify-center w-12 h-12 bg-primary bg-opacity-10 rounded-lg mb-4">
                <TrendingUp className="text-primary" size={24} />
              </div>
              <h4 className="text-xl font-bold text-dark mb-2">Body Measurements</h4>
              <p className="text-gray-600">
                Track circumferences and body fat percentage with precise Jackson-Pollock calculations.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card">
              <div className="flex items-center justify-center w-12 h-12 bg-primary bg-opacity-10 rounded-lg mb-4">
                <Heart className="text-primary" size={24} />
              </div>
              <h4 className="text-xl font-bold text-dark mb-2">Daily Logging</h4>
              <p className="text-gray-600">
                Log mood, energy, stress, sleep quality, and heart rate daily with form cooldown protection.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card">
              <div className="flex items-center justify-center w-12 h-12 bg-primary bg-opacity-10 rounded-lg mb-4">
                <Users className="text-primary" size={24} />
              </div>
              <h4 className="text-xl font-bold text-dark mb-2">Coach Dashboard</h4>
              <p className="text-gray-600">
                Full admin panel to manage clients, create plans, track supplements, and monitor progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-20 px-4">
        <div className="container-main">
          <h3 className="text-4xl font-bold text-center text-dark mb-16">
            Featured Articles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Article 1 */}
            <div className="card">
              <div className="h-48 bg-gradient-primary rounded-lg mb-4 flex items-center justify-center text-white text-center p-4">
                <h5 className="text-xl font-bold">Building Muscle in a Caloric Deficit</h5>
              </div>
              <p className="text-gray-600 mb-4">
                Learn the science and practical strategies behind maintaining muscle while losing fat.
              </p>
              <Link to="/blog" className="text-primary font-medium hover:text-secondary">
                Read More →
              </Link>
            </div>

            {/* Article 2 */}
            <div className="card">
              <div className="h-48 bg-gradient-primary rounded-lg mb-4 flex items-center justify-center text-white text-center p-4">
                <h5 className="text-xl font-bold">Female Cycle & Training Optimization</h5>
              </div>
              <p className="text-gray-600 mb-4">
                How to adjust your training and nutrition based on your menstrual cycle phases.
              </p>
              <Link to="/blog" className="text-primary font-medium hover:text-secondary">
                Read More →
              </Link>
            </div>

            {/* Article 3 */}
            <div className="card">
              <div className="h-48 bg-gradient-primary rounded-lg mb-4 flex items-center justify-center text-white text-center p-4">
                <h5 className="text-xl font-bold">Intensity Techniques for Muscle Growth</h5>
              </div>
              <p className="text-gray-600 mb-4">
                Master advanced training techniques like drop sets, supersets, and rest-pause sets.
              </p>
              <Link to="/blog" className="text-primary font-medium hover:text-secondary">
                Read More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white px-4">
        <div className="container-main text-center">
          <h3 className="text-4xl font-bold mb-6">
            Ready to Transform Your Body?
          </h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join hundreds of clients already achieving their fitness goals with professional coaching
            and detailed tracking.
          </p>

          {!isAuthenticated && (
            <div className="flex gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-light transition"
              >
                Get Started Free
              </Link>
              <Link
                to="/admin"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary transition"
              >
                Coach Login
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-12 px-4">
        <div className="container-main grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="text-primary" size={24} />
              <h4 className="text-xl font-bold">AM CULTURISMO</h4>
            </div>
            <p className="text-gray-400">Professional fitness tracking platform.</p>
          </div>

          <div>
            <h5 className="font-bold mb-4">Product</h5>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="#features" className="hover:text-white">Features</Link></li>
              <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link to="/posture-videos" className="hover:text-white">Posture Videos</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-4">For Coaches</h5>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/admin" className="hover:text-white">Admin Login</Link></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">Support</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-4">Legal</h5>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Privacy</a></li>
              <li><a href="#" className="hover:text-white">Terms</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2025 AM CULTURISMO. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
