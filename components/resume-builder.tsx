"use client";
import React, { useState, useRef, useEffect } from "react";
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

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  title: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  certifications: string[];
}

type ResumeDataPath =
  | "personalInfo.name"
  | "personalInfo.email"
  | "personalInfo.phone"
  | "personalInfo.title"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "certifications";

function getNestedValue(obj: ResumeData, path: ResumeDataPath): any {
  const parts = path.split(".");
  let result: any = obj;

  for (const part of parts) {
    if (result && typeof result === "object" && part in result) {
      result = result[part];
    } else {
      return undefined;
    }
  }

  return result;
}

function setNestedValue(
  obj: ResumeData,
  path: ResumeDataPath,
  value: any
): ResumeData {
  const newObj = { ...obj };
  const parts = path.split(".");
  let current: any = newObj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    current[part] = { ...current[part] };
    current = current[part];
  }

  const lastPart = parts[parts.length - 1];
  current[lastPart] = value;
  return newObj;
}

export function ResumeBuilder() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const initialLoadingFields: Set<ResumeDataPath> = new Set([
    "personalInfo.name",
    "personalInfo.email",
    "personalInfo.phone",
    "personalInfo.title",
    "summary",
    "experience",
    "education",
    "skills",
    "certifications",
  ] as ResumeDataPath[]);
  const [loadingFields, setLoadingFields] =
    useState<Set<ResumeDataPath>>(initialLoadingFields);

  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      title: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    certifications: [],
  });

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000");

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
      setWs(socket);
      // Simulate initial loading
      setIsInitialLoading(false);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message:", data);

      switch (data.type) {
        case "question":
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              content: data.data.question,
            },
          ]);
          if (data.data.field) {
            setLoadingFields((prev) => {
              const newSet = new Set(prev);
              if (isValidPath(data.data.field)) {
                newSet.add(data.data.field as ResumeDataPath);
              }
              return newSet;
            });
          }
          break;

        case "update":
          if (isValidPath(data.data.field)) {
            setResumeData((prev) =>
              setNestedValue(
                prev,
                data.data.field as ResumeDataPath,
                data.data.value
              )
            );
            setLoadingFields((prev) => {
              const newSet = new Set(prev);
              newSet.delete(data.data.field as ResumeDataPath);
              return newSet;
            });
          }
          break;

        case "complete":
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              content: data.data.message,
            },
          ]);
          setResumeData(data.data.finalResume);
          setLoadingFields(new Set());
          break;

        case "error":
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              content: `Error: ${data.data.message}`,
            },
          ]);
          break;
      }
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket server");
      setWs(null);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  function isValidPath(path: string): path is ResumeDataPath {
    const validPaths: ResumeDataPath[] = [
      "personalInfo.name",
      "personalInfo.email",
      "personalInfo.phone",
      "personalInfo.title",
      "summary",
      "experience",
      "education",
      "skills",
      "certifications",
    ];
    return validPaths.includes(path as ResumeDataPath);
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "" && ws && ws.readyState === WebSocket.OPEN) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "user",
          content: inputMessage,
        },
      ]);

      ws.send(
        JSON.stringify({
          type: "answer",
          content: inputMessage,
        })
      );

      setInputMessage("");
    }
  };

  const isFieldLoading = (field: ResumeDataPath) =>
    isInitialLoading || loadingFields.has(field);

  const renderSkeletonField = (field: ResumeDataPath) => {
    return isFieldLoading(field) || !getNestedValue(resumeData, field);
  };

  // Skeleton components for different sections
  const SkeletonExperience = () => (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <Briefcase className="w-5 h-5 mr-2 text-gray-400" />
        <div className="skeleton w-48 h-6"></div>
      </div>
      <div className="skeleton w-32 h-4 mb-2"></div>
      <div className="space-y-2">
        <div className="skeleton w-full h-4"></div>
        <div className="skeleton w-full h-4"></div>
        <div className="skeleton w-3/4 h-4"></div>
      </div>
    </div>
  );

  const SkeletonEducation = () => (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <GraduationCap className="w-5 h-5 mr-2 text-gray-400" />
        <div className="skeleton w-40 h-6"></div>
      </div>
      <div className="skeleton w-32 h-4"></div>
    </div>
  );

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
              <Button
                onClick={handleSendMessage}
                size="icon"
                disabled={!ws || ws.readyState !== WebSocket.OPEN}
              >
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
              {renderSkeletonField("personalInfo.name") ? (
                <div className="skeleton w-64 h-12 mx-auto"></div>
              ) : (
                resumeData.personalInfo.name
              )}
            </h1>
            <div className="text-xl text-gray-600 mt-2">
              {renderSkeletonField("personalInfo.title") ? (
                <div className="skeleton w-48 h-6 mx-auto"></div>
              ) : (
                resumeData.personalInfo.title
              )}
            </div>
          </header>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Summary
            </h2>
            {renderSkeletonField("summary") ? (
              <div className="space-y-2">
                <div className="skeleton w-full h-4"></div>
                <div className="skeleton w-full h-4"></div>
                <div className="skeleton w-3/4 h-4"></div>
              </div>
            ) : (
              <p className="text-gray-600">{resumeData.summary}</p>
            )}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Experience
            </h2>
            {renderSkeletonField("experience") ? (
              <>
                <SkeletonExperience />
              </>
            ) : (
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
            )}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Education
            </h2>
            {renderSkeletonField("education") ? (
              <>
                <SkeletonEducation />
              </>
            ) : (
              resumeData.education.map((edu, index) => (
                <div key={index} className="mb-4">
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
            )}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Skills
            </h2>
            {renderSkeletonField("skills") ? (
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="skeleton w-24 h-8 rounded-full"></div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Certifications
            </h2>
            {renderSkeletonField("certifications") ? (
              <ul className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="flex items-center">
                    <Award className="w-5 h-5 mr-2 text-gray-400" />
                    <div className="skeleton w-64 h-4"></div>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-2">
                {resumeData.certifications.map((cert, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <Award className="w-5 h-5 mr-2" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
export default ResumeBuilder;
