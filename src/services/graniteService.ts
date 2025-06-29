
// IBM Granite 3.3 Language Model Service for Job Description Segmentation
export interface JobSegments {
  companyName?: string;
  jobTitle?: string;
  location?: string;
  salaryRange?: string;
  contactInfo?: string;
  workSchedule?: string;
}

export class GraniteJobSegmentationService {
  private apiEndpoint: string;
  private modelName: string;

  constructor() {
    // IBM Granite 3.3 model configuration
    this.apiEndpoint = 'https://us-south.ml.cloud.ibm.com/ml/v1/text/generation';
    this.modelName = 'ibm/granite-3.3-8b-instruct';
  }

  async segmentJobDescription(description: string): Promise<JobSegments> {
    const prompt = this.createSegmentationPrompt(description);
    
    try {
      // TODO: Replace with actual IBM Watson ML API key
      const apiKey = 'YOUR_IBM_WATSON_ML_API_KEY';
      
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model_id: this.modelName,
          input: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.1,
            top_p: 0.9,
            repetition_penalty: 1.1
          }
        })
      });

      if (!response.ok) {
        throw new Error(`IBM Granite API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.results[0]?.generated_text || '';
      
      return this.parseSegmentedResponse(generatedText);
    } catch (error) {
      console.error('Error calling IBM Granite 3.3 model:', error);
      // Fallback to pattern matching for demo purposes
      return this.fallbackPatternMatching(description);
    }
  }

  private createSegmentationPrompt(description: string): string {
    return `
You are a job description analyzer. Extract the following information from the job description and return it in JSON format:

Job Description: "${description}"

Extract and return ONLY a JSON object with these fields:
- jobTitle: The job position/role
- companyName: The company or business name
- location: The work location (city, state, address)
- salaryRange: The salary, wage, or compensation
- workSchedule: The work schedule, hours, or shift information
- contactInfo: Any contact person or information

Return only valid JSON without any additional text or formatting.

Example output:
{
  "jobTitle": "waiter",
  "companyName": "Thien Huong Sandwiches",
  "location": "San Jose, CA",
  "salaryRange": "$16.5/hour",
  "workSchedule": "night shift Monday-Wednesday 5pm-10pm",
  "contactInfo": ""
}

JSON:`;
  }

  private parseSegmentedResponse(response: string): JobSegments {
    try {
      // Extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          companyName: parsed.companyName || '',
          jobTitle: parsed.jobTitle || '',
          location: parsed.location || '',
          salaryRange: parsed.salaryRange || '',
          contactInfo: parsed.contactInfo || '',
          workSchedule: parsed.workSchedule || ''
        };
      }
    } catch (error) {
      console.error('Error parsing Granite response:', error);
    }
    
    return {};
  }

  private fallbackPatternMatching(description: string): JobSegments {
    // Enhanced pattern matching as fallback
    const patterns = {
      jobTitle: /(?:as a|as an|job as|position as|work as|looking for|seeking|hiring)\s+(?:a\s+|an\s+)?([a-zA-Z\s/]+?)(?:\s+that|\s+who|\s+at|\s+in|\s+for|\s+with|,|\.)/i,
      companyName: /(?:at|for|with)\s+([A-Z][a-zA-Z\s&\-']+?)(?:\s+in|\s+at|\s+located|\s+salary|\s+wage|,|\.)/i,
      location: /(?:in|at|located)\s+([A-Z][a-zA-Z\s,]+?)(?:\s+salary|\s+wage|\s+pay|,|\.)/i,
      salaryRange: /(?:salary|wage|pay|compensation):\s*(\$?[\d,]+\.?\d*(?:\$|\/hour|\/hr|\/year)?)/i,
      workSchedule: /(?:shift|schedule|hours|time|work)\s+([a-zA-Z\s\-0-9:]+?)(?:\s+at|\s+in|\s+salary|,|\.)/i
    };

    const segments: JobSegments = {};
    
    Object.entries(patterns).forEach(([key, pattern]) => {
      const match = description.match(pattern);
      if (match && match[1]) {
        segments[key as keyof JobSegments] = match[1].trim();
      }
    });

    // Special handling for salary format
    const salaryMatch = description.match(/(\$?[\d,]+\.?\d*)\s*(?:\$|\/hour|\/hr|per hour)?/i);
    if (salaryMatch) {
      segments.salaryRange = salaryMatch[1].includes('$') ? salaryMatch[1] : `$${salaryMatch[1]}`;
    }

    return segments;
  }
}

export const graniteService = new GraniteJobSegmentationService();
