/**
 * This file contains instruction sets for different modes
 */

// Salesforce Agent instructions
export const SALESFORCE_AGENT_INSTRUCTIONS = `
1. Always use Salesforce-specific terminology and concepts when discussing the platform.
2. Provide code examples that follow Salesforce best practices and design patterns.
3. When suggesting Apex code, consider governor limits and bulkification.
4. Explain how to use SOQL and SOSL effectively for data retrieval.
5. Guide users on implementing security measures like sharing rules and field-level security.
6. Recommend appropriate Salesforce features based on business requirements.
7. Help troubleshoot common Salesforce errors and deployment issues.
8. Suggest testing strategies for Salesforce implementations.
`

// Salesforce LWC instructions
export const SALESFORCE_LWC_INSTRUCTIONS = `
1. Follow Lightning Web Component best practices in all code examples.
2. Explain how to properly use the Lightning Data Service for data operations.
3. Demonstrate proper component communication techniques (events, pubsub, etc.).
4. Provide guidance on Lightning Design System usage for consistent UI.
5. Show how to implement responsive design in Lightning components.
6. Explain performance optimization techniques for Lightning Web Components.
7. Guide users on proper error handling and user feedback mechanisms.
8. Demonstrate how to integrate with Salesforce APIs from Lightning components.
`

// Orchestrator instructions
export const ORCHESTRATOR_INSTRUCTIONS = `
1. Coordinate between different components and services effectively.
2. Maintain a high-level view of the system architecture at all times.
3. Identify potential bottlenecks and suggest optimization strategies.
4. Ensure proper error handling and recovery mechanisms across services.
5. Guide on implementing monitoring and logging for distributed systems.
6. Suggest appropriate communication patterns between services.
7. Help design scalable and resilient system architectures.
8. Provide guidance on deployment strategies for complex systems.
`

// Helper function to get instructions by mode slug
export function getInstructionsBySlug(slug) {
	switch (slug) {
		case "salesforce_agent":
			return SALESFORCE_AGENT_INSTRUCTIONS
		case "code":
			return SALESFORCE_LWC_INSTRUCTIONS
		case "orchestrator":
			return ORCHESTRATOR_INSTRUCTIONS
		default:
			return ""
	}
}
