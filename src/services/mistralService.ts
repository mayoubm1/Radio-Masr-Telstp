import { supabase } from '@/lib/supabase';

export interface AIHostRequest {
  action: 'generate_script' | 'translate' | 'generate_intro' | 'process_news' | 'chat';
  hostId?: string;
  hostName?: string;
  content?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  programType?: string;
  topic?: string;
  messages?: Array<{ role: string; content: string }>;
}

export interface TranslationResult {
  translation: string;
  sourceLanguage: string;
  targetLanguage: string;
  originalContent: string;
}

export interface ScriptResult {
  script: string;
  hostName: string;
  programType: string;
}

// Simulated responses for when Supabase is inactive
const simulatedResponses = {
  generate_script: (req: AIHostRequest) => ({
    script: `[Opening Music Fades]

Good morning, and welcome to Radio TELsTP! I'm ${req.hostName || 'your host'}, and today we're diving into an exciting topic: ${req.topic || 'the latest innovations in life sciences'}.

[Transition Sound]

Here at Tawasol Egypt Life Science Technology Park, we're at the forefront of groundbreaking research. Today's program will explore the remarkable advances being made right here in our laboratories.

[Brief Musical Interlude]

Let me share with you some fascinating developments...

First, our biotechnology team has achieved a significant milestone in gene therapy research. This breakthrough could potentially help millions of patients worldwide.

Second, our collaboration with international research institutions continues to grow, bringing together the brightest minds from around the globe.

[Closing Music Begins]

That's all for today's segment. Stay tuned for more updates, and remember - at TELsTP, we're not just observing the future of life sciences, we're creating it.

This is ${req.hostName || 'your host'}, signing off from Radio TELsTP.`,
    hostName: req.hostName || 'AI Host',
    programType: req.programType || 'general'
  }),

  translate: (req: AIHostRequest) => ({
    translation: `[Translated content from ${req.sourceLanguage} to ${req.targetLanguage}]\n\n${req.content}`,
    sourceLanguage: req.sourceLanguage || 'en',
    targetLanguage: req.targetLanguage || 'ar',
    originalContent: req.content || ''
  }),

  generate_intro: (req: AIHostRequest) => ({
    intro: `Welcome to Radio TELsTP! I'm ${req.hostName || 'your host'}, and you're listening to ${req.programType || 'our special program'}. Today we'll be exploring ${req.topic || 'the latest in life science innovation'}. Stay with us!`,
    hostName: req.hostName || 'AI Host',
    programType: req.programType || 'general'
  }),

  process_news: (req: AIHostRequest) => ({
    processedNews: `[NEWS UPDATE]\n\nBreaking news from Tawasol Egypt Life Science Technology Park:\n\n${req.content || 'Stay tuned for the latest updates.'}\n\n[END OF NEWS UPDATE]`,
    originalContent: req.content || ''
  }),

  chat: (req: AIHostRequest) => ({
    response: `Hello! I'm here to help you manage Radio TELsTP. I can assist with content creation, scheduling, and technical queries. How can I help you today?`,
    hostName: req.hostName || 'AI Assistant'
  })
};

export async function callMistralAI(request: AIHostRequest): Promise<any> {
  try {
    const { data, error } = await supabase.functions.invoke('mistral-ai-host', {
      body: request
    });

    if (error) {
      console.warn('Supabase function error, using simulated response:', error);
      return { success: true, data: simulatedResponses[request.action](request) };
    }

    return data;
  } catch (err) {
    console.warn('Error calling Mistral AI, using simulated response:', err);
    return { success: true, data: simulatedResponses[request.action](request) };
  }
}

export async function generateScript(hostName: string, topic: string, programType: string): Promise<ScriptResult> {
  const result = await callMistralAI({
    action: 'generate_script',
    hostName,
    topic,
    programType
  });
  return result.data;
}

export async function translateContent(content: string, sourceLanguage: string, targetLanguage: string): Promise<TranslationResult> {
  const result = await callMistralAI({
    action: 'translate',
    content,
    sourceLanguage,
    targetLanguage
  });
  return result.data;
}

export async function generateIntro(hostName: string, programType: string, topic: string): Promise<{ intro: string }> {
  const result = await callMistralAI({
    action: 'generate_intro',
    hostName,
    programType,
    topic
  });
  return result.data;
}

export async function processNews(content: string): Promise<{ processedNews: string }> {
  const result = await callMistralAI({
    action: 'process_news',
    content
  });
  return result.data;
}

export async function chatWithAI(messages: Array<{ role: string; content: string }>, hostName?: string): Promise<{ response: string }> {
  const result = await callMistralAI({
    action: 'chat',
    messages,
    hostName
  });
  return result.data;
}
