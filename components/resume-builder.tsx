"use client";

import { useState, useRef, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Send,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  sender: "bot" | "user";
  content: string;
  updateField?: keyof ResumeData;
  updateValue?: any;
}

interface Experience {
  title: string;
  company: string;
  period: string;
  achievements: string[];
}

interface Education {
  degree: string;
  school: string;
  period: string;
}

interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  certifications: string[];
}

export function ResumeBuilder() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [resumeData, setResumeData] = useState<ResumeData>({
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    summary: "",
    experience: [],
    education: [],
    skills: [],
    certifications: [],
  });

  const [loadingField, setLoadingField] = useState<keyof ResumeData | null>(
    null
  );

  const fullMessages: Message[] = [
    {
      sender: "bot",
      content:
        "Hello! I'm here to help you build your resume. What's your name?",
    },
    {
      sender: "user",
      content: "Hi, my name is John Doe.",
      updateField: "name",
      updateValue: "John Doe",
    },
    {
      sender: "bot",
      content: "Great to meet you, John! What's your current job title?",
      updateField: "title",
      updateValue: "Senior Software Engineer",
    },
    { sender: "user", content: "I'm a Senior Software Engineer." },
    {
      sender: "bot",
      content:
        "Excellent! Let's add your contact information. What's your email address?",
      updateField: "email",
      updateValue: "john.doe@example.com",
    },
    { sender: "user", content: "My email is john.doe@example.com" },
    {
      sender: "bot",
      content: "Got it. And your phone number?",
      updateField: "phone",
      updateValue: "(123) 456-7890",
    },
    { sender: "user", content: "It's (123) 456-7890" },
    {
      sender: "bot",
      content: "Perfect. Where are you located?",
      updateField: "location",
      updateValue: "New York, NY",
    },
    { sender: "user", content: "I'm in New York, NY." },
    {
      sender: "bot",
      content: "Great. Do you have a professional website?",
      updateField: "website",
      updateValue: "www.johndoe.com",
    },
    { sender: "user", content: "Yes, it's www.johndoe.com" },
    {
      sender: "bot",
      content:
        "Excellent! Now, let's create a professional summary. Can you tell me about your background and career goals?",
      updateField: "summary",
      updateValue:
        "Experienced software engineer with 5 years of expertise in web development, specializing in building scalable and efficient applications. Proven track record of leading development teams and implementing innovative solutions. Seeking a leadership role to leverage technical skills and mentoring abilities to drive project success and team growth.",
    },
    {
      sender: "user",
      content:
        "I'm a software engineer with 5 years of experience. I specialize in web development and I'm looking to move into a leadership role.",
    },
    {
      sender: "bot",
      content:
        "Great summary! Let's move on to your work experience. What's your current job?",
      updateField: "experience",
      updateValue: [
        {
          title: "Senior Software Engineer",
          company: "Tech Innovations Inc.",
          period: "2018 - Present",
          achievements: [
            "Led the development of a cloud-based IoT platform, increasing company revenue by 25%",
            "Mentored junior developers, improving team productivity and code quality",
            "Implemented agile methodologies, reducing project delivery time and enhancing collaboration",
            "Architected and developed scalable web applications using modern JavaScript frameworks",
          ],
        },
      ],
    },
    {
      sender: "user",
      content:
        "I'm currently a Senior Software Engineer at Tech Innovations Inc. since 2018. I've led several major projects and mentored junior developers.",
    },
    {
      sender: "bot",
      content:
        "Impressive! Let's add your education. What's your highest degree?",
      updateField: "education",
      updateValue: [
        {
          degree: "Master of Science in Computer Science",
          school: "Tech University",
          period: "2013 - 2015",
        },
      ],
    },
    {
      sender: "user",
      content:
        "I have a Master's degree in Computer Science from Tech University, completed in 2015.",
    },
    {
      sender: "bot",
      content: "Excellent. Finally, let's list your top skills.",
      updateField: "skills",
      updateValue: ["JavaScript", "React", "Node.js", "Python", "AWS"],
    },
    {
      sender: "user",
      content: "My top skills are JavaScript, React, Node.js, Python, and AWS.",
    },
    {
      sender: "bot",
      content:
        "Great! I've added those skills. Do you have any certifications?",
      updateField: "certifications",
      updateValue: ["AWS Certified Developer", "Certified Scrum Master"],
    },
    {
      sender: "user",
      content:
        "Yes, I'm an AWS Certified Developer and a Certified Scrum Master.",
    },
    {
      sender: "bot",
      content:
        "Perfect! I've added those certifications to your resume. Is there anything else you'd like to add or modify?",
    },
  ];

  useEffect(() => {
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      if (messageIndex < fullMessages.length) {
        const message = fullMessages[messageIndex];
        setMessages((prev) => [...prev, message]);
        if (message.updateField && message.updateValue) {
          setLoadingField(message.updateField);
          setTimeout(() => {
            setResumeData((prev) => ({
              ...prev,
              [message.updateField!]: message.updateValue,
            }));
            setLoadingField(null);
          }, 5000); // Delay of 5 seconds before updating the resume data
        }
        messageIndex++;
      } else {
        clearInterval(messageInterval);
      }
    }, 2000);

    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const isFieldLoading = (field: keyof ResumeData) => loadingField === field;

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", content: inputMessage },
      ]);
      setInputMessage("");
      // Simulating a bot response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "bot",
            content:
              "I understand. I've updated your resume with that information. Is there anything else you'd like to modify?",
          },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Chat Interface */}
      <div className="w-full h-screen md:w-1/3 p-4 bg-white shadow-md">
        <Card className="h-[calc(100vh-2rem)]">
          <CardContent className="p-4 flex flex-col h-full">
            <ScrollArea className="flex-grow mb-4 pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[80%] ${
                        message.sender === "user"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {message.sender === "user" ? "U" : "B"}
                        </AvatarFallback>
                        <AvatarImage />
                      </Avatar>
                      <div
                        className={`p-2 rounded-lg ${
                          message.sender === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                        }`}
                      >
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
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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
      <div className="w-full md:w-2/3 p-4 overflow-hidden">
        <div className="bg-white shadow-lg p-8 h-screen overflow-y-auto">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800">
              {isFieldLoading("name") ? (
                <span className="skeleton w-64 h-12 mx-auto inline-block"></span>
              ) : (
                resumeData.name || "Your Name"
              )}
            </h1>
            <div className="text-xl text-gray-600 mt-2">
              {isFieldLoading("title") ? (
                <span className="skeleton w-48 h-6 mx-auto inline-block"></span>
              ) : (
                resumeData.title || "Your Title"
              )}
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <div className="flex items-center text-gray-600">
                <Mail className="w-5 h-5 mr-2" />
                <span>
                  {isFieldLoading("email") ? (
                    <span className="skeleton w-36 h-4 inline-block"></span>
                  ) : (
                    resumeData.email || "your.email@example.com"
                  )}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-5 h-5 mr-2" />
                <span>
                  {isFieldLoading("phone") ? (
                    <span className="skeleton w-32 h-4 inline-block"></span>
                  ) : (
                    resumeData.phone || "(123) 456-7890"
                  )}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                <span>
                  {isFieldLoading("location") ? (
                    <span className="skeleton w-24 h-4 inline-block"></span>
                  ) : (
                    resumeData.location || "Your Location"
                  )}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <Globe className="w-5 h-5 mr-2" />
                <span>
                  {isFieldLoading("website") ? (
                    <span className="skeleton w-40 h-4 inline-block"></span>
                  ) : (
                    resumeData.website || "www.yourwebsite.com"
                  )}
                </span>
              </div>
            </div>
          </header>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Summary
            </h2>
            <p className="text-gray-600">
              {isFieldLoading("summary") ? (
                <div>
                  <div className="skeleton w-full h-4 mb-2"></div>
                  <div className="skeleton w-full h-4 mb-2"></div>
                  <div className="skeleton w-3/4 h-4"></div>
                </div>
              ) : (
                resumeData.summary ||
                "Your professional summary will appear here."
              )}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Experience
            </h2>
            {isFieldLoading("experience") ? (
              <div className="mb-4">
                <div className="skeleton w-3/4 h-6 mb-2"></div>
                <div className="skeleton w-1/2 h-4 mb-2"></div>
                <div className="skeleton w-full h-4 mb-1"></div>
                <div className="skeleton w-full h-4 mb-1"></div>
                <div className="skeleton w-3/4 h-4"></div>
              </div>
            ) : resumeData.experience.length > 0 ? (
              resumeData.experience.map((job, index) => (
                <div key={index} className="mb-4">
                  <div className="flex items-center mb-2">
                    <Briefcase className="w-5 h-5 mr-2 text-gray-600" />
                    <h3 className="text-xl font-medium text-gray-800">
                      {job.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-2">
                    {job.company} | {job.period}
                  </p>
                  <ul className="list-disc list-inside text-gray-600">
                    {job.achievements.map((achievement, achIndex) => (
                      <li key={achIndex}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p>No experience added yet.</p>
            )}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Education
            </h2>
            {isFieldLoading("education") ? (
              <div className="mb-2">
                <div className="skeleton w-3/4 h-6 mb-2"></div>
                <div className="skeleton w-1/2 h-4"></div>
              </div>
            ) : resumeData.education.length > 0 ? (
              resumeData.education.map((edu, index) => (
                <div key={index} className="mb-2">
                  <div className="flex items-center mb-2">
                    <GraduationCap className="w-5 h-5 mr-2 text-gray-600" />
                    <h3 className="text-xl font-medium text-gray-800">
                      {edu.degree}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    {edu.school} | {edu.period}
                  </p>
                </div>
              ))
            ) : (
              <p>No education added yet.</p>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {isFieldLoading("skills") ? (
                <div>
                  <div className="skeleton w-20 h-6 rounded-full"></div>
                  <div className="skeleton w-24 h-6 rounded-full"></div>
                  <div className="skeleton w-16 h-6 rounded-full"></div>
                  <div className="skeleton w-28 h-6 rounded-full"></div>
                  <div className="skeleton w-20 h-6 rounded-full"></div>
                </div>
              ) : resumeData.skills.length > 0 ? (
                resumeData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p>No skills added yet.</p>
              )}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Certifications
            </h2>
            <ul className="space-y-2">
              {isFieldLoading("certifications") ? (
                <div>
                  <li className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    <div className="skeleton w-48 h-4"></div>
                  </li>
                  <li className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    <div className="skeleton w-56 h-4"></div>
                  </li>
                </div>
              ) : resumeData.certifications.length > 0 ? (
                resumeData.certifications.map((cert) => (
                  <li key={cert} className="flex items-center text-gray-600">
                    <Award className="w-5 h-5 mr-2" />
                    <span>{cert}</span>
                  </li>
                ))
              ) : (
                <p>No certifications added yet.</p>
              )}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
