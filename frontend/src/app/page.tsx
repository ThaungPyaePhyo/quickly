'use client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight, Briefcase, Users, Star, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Clean Logo and Header */}
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center mx-auto mb-6">
              <Image
                src="/favicon.svg"
                alt="Logo"
                width={28}
                height={28}
                priority
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">
              Welcome to Quickly
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The modern job platform that connects professionals with opportunities. 
              Find your next project or hire the perfect talent.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              asChild 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-medium h-11"
            >
              <a href="/login">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              className="border-gray-300 hover:bg-gray-50 px-8 py-3 font-medium h-11"
            >
              <a href="/register">
                Create Account
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Why Choose Quickly?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the future of job matching with our innovative platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Quality Jobs
                </h3>
                <p className="text-gray-600 text-sm">
                  Access premium job opportunities from verified employers
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Skilled Professionals
                </h3>
                <p className="text-gray-600 text-sm">
                  Connect with talented professionals ready for your projects
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Quick Matching
                </h3>
                <p className="text-gray-600 text-sm">
                  Fast and efficient job matching powered by smart algorithms
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Trusted Platform
                </h3>
                <p className="text-gray-600 text-sm">
                  Secure, reliable platform with verified users and reviews
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}