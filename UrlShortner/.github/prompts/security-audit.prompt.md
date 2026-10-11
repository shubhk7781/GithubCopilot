---
name: security-audit
agent: ask
description: Use this prompt to perform a comprehensive security audit on the codebase.
---

<!-- Tip: Use /create-prompt in chat to generate content with agent assistance -->

Perform a security audit on the codebase, identifying potential vulnerabilities, security risks, and areas for improvement. 
Output the findings in a markdown table format having columns for srial no, severity, file path(actual link to the file), line number, function or method name, code snippet, identified security controls, potential impact, Vulnerability, Risk Level, Description, and Recommended Mitigation.


Next ask user which issue they want to fix either by replying all or a comma seperated list of serial numbers. Ater the reply run a seperate subAgents(#runSubagent) to fix each issue that the user has specified. Each subAgent should report back to the main with a simple `subAgentSucess : true | false`.