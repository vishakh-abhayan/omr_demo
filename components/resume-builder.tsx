'use client'

import { useState, useRef, useEffect } from 'react'
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Award, Send } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ResumeBuilder() {
  const [messages, setMessages] = useState([
    { sender: 'bot', content: 'Hello! I\'m here to help you build your resume. What\'s your name?' },
    { sender: 'user', content: 'Hi, my name is John Doe.' },
    { sender: 'bot', content: 'Great to meet you, John! Let\'s start with your professional summary. Can you tell me a bit about your background and career goals?' },
    { sender: 'user', content: 'I\'m a software engineer with 5 years of experience. I specialize in web development and I\'m looking to move into a leadership role.' },
    { sender: 'bot', content: 'Excellent! I\'ve added a summary based on that. Now, let\'s move on to your work experience. What was your most recent job?' },
    { sender: 'user', content: 'I\'ve been working as a Senior Software Engineer at Tech Innovations Inc. since 2018.' },
    { sender: 'bot', content: 'Got it. What are some of your key achievements in this role?' },
    { sender: 'user', content: 'I led the development of a cloud-based IoT platform that increased company revenue by 25%. I also mentored junior developers and implemented agile methodologies.' },
    { sender: 'bot', content: 'Impressive achievements! I\'ve added those to your experience section. Let\'s add your education next. What\'s your highest level of education?' },
    { sender: 'user', content: 'I have a Master\'s degree in Computer Science from Tech University, completed in 2015.' },
    { sender: 'bot', content: 'Great, I\'ve added your education. Lastly, let\'s add some skills. What are your top technical skills?' },
    { sender: 'user', content: 'My top skills are JavaScript, React, Node.js, Python, and AWS.' },
    { sender: 'bot', content: 'Perfect! I\'ve added those skills to your resume. Is there anything else you\'d like to add or modify?' },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      setMessages(prevMessages => [...prevMessages, { sender: 'user', content: inputMessage }])
      setInputMessage('')
      // Simulating a bot response
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { sender: 'bot', content: 'I understand. I\'ve updated your resume with that information. Is there anything else you\'d like to modify?' }])
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Chat Interface */}
      <div className="w-full md:w-1/3 p-4 bg-white shadow-md">
        <Card className="h-[calc(100vh-2rem)]">
          <CardContent className="p-4 flex flex-col h-full">
            <ScrollArea className="flex-grow mb-4 pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{message.sender === 'user' ? 'U' : 'B'}</AvatarFallback>
                        <AvatarImage src={message.sender === 'user' ? '/placeholder.svg?height=32&width=32' : '/placeholder.svg?height=32&width=32'} />
                      </Avatar>
                      <div className={`p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex items-center mt-4">
              <Input
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-grow mr-2"
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resume Template */}
      <div className="w-full md:w-2/3 p-4">
        <div className="bg-white shadow-lg p-8 min-h-[calc(100vh-2rem)] overflow-y-auto">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800">John Doe</h1>
            <p className="text-xl text-gray-600 mt-2">Senior Software Engineer</p>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <div className="flex items-center text-gray-600">
                <Mail className="w-5 h-5 mr-2" />
                <span>john.doe@example.com</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-5 h-5 mr-2" />
                <span>(123) 456-7890</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                <span>New York, NY</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Globe className="w-5 h-5 mr-2" />
                <span>www.johndoe.com</span>
              </div>
            </div>
          </header>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Summary</h2>
            <p className="text-gray-600">
              Experienced software engineer with 5 years of expertise in web development, specializing in building scalable and efficient applications. Proven track record of leading development teams and implementing innovative solutions. Seeking a leadership role to leverage technical skills and mentoring abilities to drive project success and team growth.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Experience</h2>
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Briefcase className="w-5 h-5 mr-2 text-gray-600" />
                <h3 className="text-xl font-medium text-gray-800">Senior Software Engineer</h3>
              </div>
              <p className="text-gray-600 mb-2">Tech Innovations Inc. | 2018 - Present</p>
              <ul className="list-disc list-inside text-gray-600">
                <li>Led the development of a cloud-based IoT platform, increasing company revenue by 25%</li>
                <li>Mentored junior developers, improving team productivity and code quality</li>
                <li>Implemented agile methodologies, reducing project delivery time and enhancing collaboration</li>
                <li>Architected and developed scalable web applications using modern JavaScript frameworks</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center mb-2">
                <Briefcase className="w-5 h-5 mr-2 text-gray-600" />
                <h3 className="text-xl font-medium text-gray-800">Software Engineer</h3>
              </div>
              <p className="text-gray-600 mb-2">StartUp Solutions | 2015 - 2018</p>
              <ul className="list-disc list-inside text-gray-600">
                <li>Developed and maintained web applications using React and Node.js</li>
                <li>Collaborated with UX designers to implement responsive design, improving user engagement by 15%</li>
                <li>Optimized database queries, reducing page load times by 40%</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Education</h2>
            <div className="mb-2">
              <div className="flex items-center mb-2">
                <GraduationCap className="w-5 h-5 mr-2 text-gray-600" />
                <h3 className="text-xl font-medium text-gray-800">Master of Science in Computer Science</h3>
              </div>
              <p className="text-gray-600">Tech University | 2013 - 2015</p>
            </div>
            <div>
              <div className="flex items-center mb-2">
                <GraduationCap className="w-5 h-5 mr-2 text-gray-600" />
                <h3 className="text-xl font-medium text-gray-800">Bachelor of Science in Software Engineering</h3>
              </div>
              <p className="text-gray-600">State University | 2009 - 2013</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'RESTful APIs', 'Git', 'Agile', 'CI/CD', 'Docker'].map((skill) => (
                <span key={skill} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Certifications</h2>
            <ul className="space-y-2">
              {['AWS Certified Developer', 'Certified Scrum Master', 'Google Cloud Professional Engineer'].map((cert) => (
                <li key={cert} className="flex items-center text-gray-600">
                  <Award className="w-5 h-5 mr-2" />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}