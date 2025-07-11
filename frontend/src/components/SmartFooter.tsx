import Link from 'next/link';
import { Heart,  HelpCircle, Shield,  Users, Briefcase, PlusCircle,  MessageCircle  } from 'lucide-react';

function MinimalFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            © 2025 Quickly. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link 
              href="/help" 
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1"
            >
              <HelpCircle size={14} />
              Help Center
            </Link>
            <Link 
              href="/contact" 
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1"
            >
              <MessageCircle size={14} />
              Contact
            </Link>
            <Link 
              href="/privacy" 
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1"
            >
              <Shield size={14} />
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ContextualFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Stats */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Our Community</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">1,500+ Active Users</div>
                  <div className="text-xs text-gray-500">Join thousands finding work</div>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Briefcase className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">200+ Jobs Posted</div>
                  <div className="text-xs text-gray-500">This month</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link 
                href="/jobs" 
                className="block bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-700 px-4 py-3 rounded-lg transition-colors duration-200 border border-gray-200 hover:border-blue-200"
              >
                <div className="flex items-center justify-center gap-2">
                  <Briefcase size={16} />
                  Browse Jobs
                </div>
              </Link>
              <Link 
                href="/jobs/new" 
                className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center justify-center gap-2">
                  <PlusCircle size={16} />
                  Post a Job
                </div>
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="text-center md:text-right">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="space-y-3">
              <Link 
                href="/help" 
                className="flex items-center justify-center md:justify-end gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm">Help Center</span>
              </Link>
              <Link 
                href="/contact" 
                className="flex items-center justify-center md:justify-end gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">Contact Support</span>
              </Link>
              <div className="text-xs text-gray-500 mt-2">
                We typically respond within 24 hours
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              © 2025 Quickly. Made with <Heart className="w-4 h-4 inline text-red-500" /> for job seekers.
            </div>
            <div className="flex items-center gap-6">
              <Link 
                href="/privacy" 
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link 
                href="/cookies" 
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface SmartFooterProps {
  user?: any;
  page?: 'dashboard' | 'jobs' | 'profile' | 'public' | 'messages';
}

export default function SmartFooter({ user, page = 'public' }: SmartFooterProps) {
  if (user && (page === 'dashboard' || page === 'messages')) {
    return null;
  }

  if (page === 'jobs') {
    return <ContextualFooter />;
  }

  if (user && (page === 'profile')) {
    return <MinimalFooter />;
  }

    return <MinimalFooter />;

}

export { MinimalFooter, ContextualFooter  };