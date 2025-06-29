
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
      // Fallback to enhanced pattern matching for demo purposes
      return this.fallbackPatternMatching(description);
    }
  }

  private createSegmentationPrompt(description: string): string {
    return `
You are an expert job description analyzer. Your task is to extract specific information from job descriptions with high accuracy.

Job Description: "${description}"

Extract the following information and return ONLY a valid JSON object with these exact fields:
- jobTitle: The job position/role (e.g., "Waiter", "Software Engineer")
- companyName: The business/company name (e.g., "Thien Huong sandwiches")
- location: The work location as city, state format (e.g., "San Jose, CA")
- salaryRange: The salary/wage with currency and period (e.g., "$16-18 per hour", "$50,000/year")
- workSchedule: The work days and hours (e.g., "Monday - Wednesday, 5pm - 10pm")
- contactInfo: Any contact person mentioned (leave empty if none)

Rules:
1. Extract exact information from the text
2. For location, use "City, State" format
3. For salary, preserve the original format but ensure currency symbol is included
4. For schedule, include both days and times if available
5. If information is not available, use empty string ""

Example:
Input: "a job as a waiter at Thien Huong sandwiches, that works night shift from Monday - Wednesday, 5pm - 10pm, at in San Jose CA , salary $16-18 per hour"
Output:
{
  "jobTitle": "Waiter",
  "companyName": "Thien Huong sandwiches",
  "location": "San Jose, CA",
  "salaryRange": "$16-18 per hour",
  "workSchedule": "Monday - Wednesday, 5pm - 10pm",
  "contactInfo": ""
}

Return only the JSON object, no additional text:`;
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
    const segments: JobSegments = {};
    
    // Enhanced job title extraction
    const jobTitlePatterns = [
      /(?:job as|as a|as an|work as|position as|looking for|seeking|hiring)\s+(?:a\s+|an\s+)?([a-zA-Z\s/\-]+?)(?:\s+(?:at|that|who|in|for|with)|,|\.|$)/i,
      /(?:^|\s)([a-zA-Z]+(?:\s+[a-zA-Z]+)*)\s+(?:job|position|role)(?:\s|$)/i
    ];
    
    for (const pattern of jobTitlePatterns) {
      const match = description.match(pattern);
      if (match && match[1]) {
        segments.jobTitle = this.capitalizeWords(match[1].trim());
        break;
      }
    }
    
    // Enhanced company name extraction
    const companyPatterns = [
      /(?:at|for|with)\s+([A-Z][A-Za-z\s&\-'\.]+?)(?:\s*,|\s+(?:that|in|at|located|san|los|new|salary|wage|pay|\d))/i,
      /(?:^|\s)([A-Z][A-Za-z\s&\-'\.]+?)\s+(?:restaurant|company|corp|inc|llc|store|shop|cafe|sandwiches)/i
    ];
    
    for (const pattern of companyPatterns) {
      const match = description.match(pattern);
      if (match && match[1] && match[1].length > 2) {
        segments.companyName = match[1].trim();
        break;
      }
    }
    
    // Enhanced location extraction (City, State format)
    const locationPatterns = [
      /(?:in|at|located)\s+([A-Z][a-zA-Z\s]+),?\s+(CA|California|NY|New York|TX|Texas|FL|Florida|IL|Illinois|WA|Washington|OR|Oregon|NV|Nevada)/i,
      /([A-Z][a-zA-Z\s]+),?\s+(CA|California|NY|New York|TX|Texas|FL|Florida|IL|Illinois|WA|Washington|OR|Oregon|NV|Nevada)(?:\s|,|$)/i
    ];
    
    for (const pattern of locationPatterns) {
      const match = description.match(pattern);
      if (match && match[1] && match[2]) {
        const city = match[1].trim().replace(',', '');
        const state = match[2] === 'California' ? 'CA' : match[2] === 'New York' ? 'NY' : match[2];
        segments.location = `${city}, ${state}`;
        break;
      }
    }
    
    // Enhanced salary extraction
    const salaryPatterns = [
      /salary[:\s]*(\$?\d+(?:[,\.]?\d+)*(?:\s*-\s*\$?\d+(?:[,\.]?\d+)*)?)\s*(?:per\s+hour|\/hour|\/hr|hourly|per hour)/i,
      /(\$\d+(?:[,\.]?\d+)*(?:\s*-\s*\$?\d+(?:[,\.]?\d+)*)?)\s*(?:per\s+hour|\/hour|\/hr|hourly|per hour)/i,
      /salary[:\s]*(\$?\d+(?:[,\.]?\d+)*(?:\s*-\s*\$?\d+(?:[,\.]?\d+)*)?)\s*(?:per\s+year|\/year|annually|yearly)/i,
      /(\$\d+(?:[,\.]?\d+)*(?:\s*-\s*\$?\d+(?:[,\.]?\d+)*)?)\s*(?:per\s+year|\/year|annually|yearly)/i
    ];
    
    for (const pattern of salaryPatterns) {
      const match = description.match(pattern);
      if (match && match[1]) {
        let salary = match[1].trim();
        if (!salary.startsWith('$')) {
          salary = '$' + salary;
        }
        if (pattern.source.includes('hour')) {
          segments.salaryRange = salary + ' per hour';
        } else if (pattern.source.includes('year')) {
          segments.salaryRange = salary + ' per year';
        } else {
          segments.salaryRange = salary;
        }
        break;
      }
    }
    
    // Enhanced work schedule extraction
    const schedulePatterns = [
      /((?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)(?:\s*-\s*(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday))?)[,\s]*(\d{1,2}(?:am|pm)?\s*-\s*\d{1,2}(?:am|pm)?)/i,
      /(?:shift|schedule|hours|work|time)\s+(?:from\s+)?((?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)(?:\s*-\s*(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday))?)[,\s]*(\d{1,2}(?:am|pm)?\s*-\s*\d{1,2}(?:am|pm)?)/i,
      /((?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)(?:\s*-\s*(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday))?)[,\s]+(\d{1,2}(?:am|pm)?\s*-\s*\d{1,2}(?:am|pm)?)/i
    ];
    
    for (const pattern of schedulePatterns) {
      const match = description.match(pattern);
      if (match && match[1] && match[2]) {
        const days = this.capitalizeWords(match[1].trim());
        const hours = match[2].trim();
        segments.workSchedule = `${days}, ${hours}`;
        break;
      }
    }
    
    // Set default contact info if none found
    if (!segments.contactInfo) {
      segments.contactInfo = '';
    }

    console.log('Enhanced parsing results:', segments);
    return segments;
  }
  
  private capitalizeWords(str: string): string {
    return str.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  }
}

export const graniteService = new GraniteJobSegmentationService();
