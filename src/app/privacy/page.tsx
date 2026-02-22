import { Metadata } from 'next';
import { Shield, Eye, Lock, Database, Globe, Users, Calendar, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | WireSizes.com',
  description: 'Privacy Policy for WireSizes.com - Learn how we collect, use, and protect your information when using our electrical wire sizing calculators.',
  keywords: 'privacy policy, data protection, wiresizes privacy, electrical calculator privacy',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-gray-900 to-slate-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Shield className="w-8 h-8 text-blue-300" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
                <p className="text-xl text-gray-300">Your Privacy and Data Protection</p>
              </div>
            </div>
            
            <div className="bg-blue-600/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-blue-100">
                <strong>Last Updated:</strong> February 4, 2026 • 
                <strong className="ml-4">Effective Date:</strong> February 4, 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Introduction */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Introduction</h2>
              </div>
              
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  WireSizes.com ("we," "our," or "us") is committed to protecting your privacy and ensuring transparency 
                  about how we collect, use, and safeguard your information. This Privacy Policy explains our practices 
                  regarding data collection and use when you access or use our electrical wire sizing calculator website 
                  and related services.
                </p>
                
                <p className="text-gray-700 leading-relaxed mt-4">
                  By using our website, you agree to the collection and use of information in accordance with this policy. 
                  If you do not agree with our policies and practices, do not use our website.
                </p>
              </div>
            </div>

            {/* Information We Collect */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Database className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Automatically Collected Information</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex gap-2">
                      <span className="text-blue-600">•</span>
                      <span><strong>Usage Data:</strong> Pages visited, time spent, click patterns, and navigation behavior</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-600">•</span>
                      <span><strong>Device Information:</strong> Browser type, operating system, device identifiers</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-600">•</span>
                      <span><strong>Technical Data:</strong> IP address, referring URLs, access times and dates</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-600">•</span>
                      <span><strong>Performance Metrics:</strong> Page load times, error logs, system performance data</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Calculator Usage Information</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex gap-2">
                      <span className="text-green-600">•</span>
                      <span><strong>Calculation Inputs:</strong> Values entered into calculators (anonymized and aggregated)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-green-600">•</span>
                      <span><strong>Tool Usage:</strong> Which calculators are used most frequently</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-green-600">•</span>
                      <span><strong>Error Tracking:</strong> Calculation errors or invalid inputs (for improvement purposes)</span>
                    </li>
                  </ul>
                  <div className="mt-3 p-3 bg-white rounded border border-green-200">
                    <AlertCircle className="w-4 h-4 text-green-600 inline mr-2" />
                    <span className="text-sm text-green-800">
                      <strong>Note:</strong> We do not store individual calculation values or link them to specific users.
                    </span>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">Information You Provide</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex gap-2">
                      <span className="text-purple-600">•</span>
                      <span><strong>Contact Information:</strong> Email address when contacting support</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-purple-600">•</span>
                      <span><strong>Feedback:</strong> Comments, suggestions, or bug reports submitted voluntarily</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-purple-600">•</span>
                      <span><strong>Survey Responses:</strong> Responses to optional user experience surveys</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Information */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Improvement</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex gap-2">
                      <span className="text-purple-600">✓</span>
                      <span>Enhance calculator accuracy and performance</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-purple-600">✓</span>
                      <span>Identify and fix technical issues</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-purple-600">✓</span>
                      <span>Optimize user interface and experience</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-purple-600">✓</span>
                      <span>Develop new features based on usage patterns</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Security & Compliance</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex gap-2">
                      <span className="text-purple-600">✓</span>
                      <span>Prevent fraud and security threats</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-purple-600">✓</span>
                      <span>Monitor for abuse and unauthorized access</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-purple-600">✓</span>
                      <span>Comply with legal and regulatory requirements</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-purple-600">✓</span>
                      <span>Maintain system integrity and availability</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Cookies and Tracking */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-900">Cookies and Tracking Technologies</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                  <h3 className="text-lg font-semibold text-orange-900 mb-3">Essential Cookies</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    These cookies are necessary for the website to function properly and cannot be disabled.
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Session management and security</li>
                    <li>• User preferences and settings</li>
                    <li>• Load balancing and performance optimization</li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Analytics Cookies</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    These help us understand how visitors interact with our website by collecting anonymous information.
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Google Analytics (anonymized IP addresses)</li>
                    <li>• Usage statistics and performance metrics</li>
                    <li>• Popular content and navigation patterns</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>Cookie Control:</strong> Most browsers allow you to control cookies through their settings. 
                    However, disabling cookies may affect website functionality. You can opt out of Google Analytics 
                    using their browser add-on.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Sharing */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">Data Sharing and Disclosure</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-green-100 rounded-lg p-6 border-2 border-green-300">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">We DO NOT Sell Your Data</h3>
                  <p className="text-green-800">
                    We do not sell, rent, or trade your personal information to third parties for marketing purposes.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Limited Data Sharing</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Service Providers</h4>
                      <p className="text-sm text-gray-700">
                        Third-party services that help us operate our website (hosting, analytics, security) 
                        under strict confidentiality agreements.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Legal Requirements</h4>
                      <p className="text-sm text-gray-700">
                        When required by law, court order, or to protect our rights, property, 
                        or safety and that of our users.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Security */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Safeguards</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex gap-2">
                      <span className="text-blue-600">🔒</span>
                      <span>SSL/TLS encryption for all data transmission</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-600">🔒</span>
                      <span>Regular security audits and vulnerability testing</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-600">🔒</span>
                      <span>Secure server infrastructure and access controls</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-600">🔒</span>
                      <span>Data minimization and anonymization practices</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Organizational Measures</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li className="flex gap-2">
                      <span className="text-blue-600">👥</span>
                      <span>Limited access on need-to-know basis</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-600">👥</span>
                      <span>Employee training on data protection</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-600">👥</span>
                      <span>Incident response and breach notification procedures</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-600">👥</span>
                      <span>Regular policy review and updates</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Your Rights */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Your Rights and Choices</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2">Access Rights</h4>
                    <p className="text-sm text-green-800">
                      Request information about what personal data we collect and how it's used.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Correction Rights</h4>
                    <p className="text-sm text-blue-800">
                      Request correction of inaccurate or incomplete personal information.
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h4 className="font-semibold text-purple-900 mb-2">Deletion Rights</h4>
                    <p className="text-sm text-purple-800">
                      Request deletion of your personal data, subject to legal requirements.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <h4 className="font-semibold text-orange-900 mb-2">Opt-Out Rights</h4>
                    <p className="text-sm text-orange-800">
                      Opt out of analytics tracking and non-essential data collection.
                    </p>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <h4 className="font-semibold text-red-900 mb-2">Portability Rights</h4>
                    <p className="text-sm text-red-800">
                      Request a copy of your data in a machine-readable format.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Contact Us</h4>
                    <p className="text-sm text-gray-700">
                      Email us at <a href="mailto:privacy@wiresizes.com" className="text-blue-600 hover:underline">privacy@wiresizes.com</a> to exercise your rights.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Retention */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">Data Retention</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-3">Retention Periods</h3>
                  <ul className="space-y-2 text-indigo-800 text-sm">
                    <li>• <strong>Usage Analytics:</strong> 26 months (Google Analytics default)</li>
                    <li>• <strong>Server Logs:</strong> 90 days for security and troubleshooting</li>
                    <li>• <strong>Contact Information:</strong> Until you request deletion or 7 years</li>
                    <li>• <strong>Feedback/Support:</strong> 3 years for service improvement</li>
                  </ul>
                </div>

                <p className="text-gray-700 text-sm">
                  We retain data only as long as necessary for the purposes outlined in this policy or as required 
                  by law. Data is securely deleted when no longer needed.
                </p>
              </div>
            </div>

            {/* International Transfers */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-6 h-6 text-teal-600" />
                <h2 className="text-2xl font-bold text-gray-900">International Data Transfers</h2>
              </div>

              <div className="bg-teal-50 rounded-lg p-6 border border-teal-200">
                <p className="text-teal-800 text-sm leading-relaxed">
                  Our servers are located in the United States. If you are accessing our website from outside the U.S., 
                  your information may be transferred to, stored, and processed in the U.S. We ensure appropriate 
                  safeguards are in place for international data transfers, including compliance with applicable 
                  data protection laws.
                </p>
              </div>
            </div>

            {/* Children's Privacy */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-pink-600" />
                <h2 className="text-2xl font-bold text-gray-900">Children's Privacy</h2>
              </div>

              <div className="bg-pink-50 rounded-lg p-6 border border-pink-200">
                <p className="text-pink-800 text-sm leading-relaxed">
                  Our website is not directed at children under 13 years of age. We do not knowingly collect 
                  personal information from children under 13. If we learn that we have collected information 
                  from a child under 13, we will delete that information promptly. If you believe we have 
                  collected information from a child under 13, please contact us immediately.
                </p>
              </div>
            </div>

            {/* Changes to Policy */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-amber-600" />
                <h2 className="text-2xl font-bold text-gray-900">Changes to This Privacy Policy</h2>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700">
                  We may update this Privacy Policy from time to time to reflect changes in our practices, 
                  technology, legal requirements, or other factors.
                </p>

                <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                  <h3 className="font-semibold text-amber-900 mb-3">Notification of Changes</h3>
                  <ul className="space-y-2 text-amber-800 text-sm">
                    <li>• Material changes will be prominently posted on our website</li>
                    <li>• Updated "Last Modified" date will reflect when changes take effect</li>
                    <li>• Continued use of our website constitutes acceptance of changes</li>
                    <li>• Users with contact information may receive email notifications for significant changes</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-blue-200" />
                <h2 className="text-2xl font-bold">Contact Us About Privacy</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Privacy Questions</h3>
                  <div className="space-y-2 text-blue-100">
                    <p>Email: <a href="mailto:privacy@wiresizes.com" className="text-white font-semibold hover:underline">privacy@wiresizes.com</a></p>
                    <p>Response Time: Within 30 days</p>
                    <p>Available: Monday-Friday, 9 AM-5 PM EST</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Data Protection Officer</h3>
                  <div className="text-blue-100">
                    <p>For EU residents and data protection inquiries:</p>
                    <p className="mt-2">Email: <a href="mailto:dpo@wiresizes.com" className="text-white font-semibold hover:underline">dpo@wiresizes.com</a></p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}