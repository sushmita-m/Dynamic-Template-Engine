import * as core from '@actions/core';
import * as github from '@actions/github';

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('githubToken');
    const octokit = github.getOctokit(token);
    const { repo, owner } = github.context.repo;
    const openIssueResponse = await octokit.issues.listForRepo({
      repo,
      owner,
      state: 'open',
    });
    const openUnassignedIssueResponse = await octokit.issues.listForRepo({
      repo,
      owner,
      state: 'open',
      assignee: 'none',
    });
    const openIssues = openIssueResponse.data;
    const openIssuesResp: any = openIssueResponse;
    let openIssuesLink: string = openIssuesResp.url;
    const openUnassignedIssues = openUnassignedIssueResponse.data;
    let openIssuesUnassignedLink = '';
    core.setOutput('openIssues', `${openIssues.length}`);
    core.setOutput('openIssuesUnassigned', `${openUnassignedIssues.length}`);
    openIssuesLink = openIssuesLink.replace('api.github.com/repos/', 'github.com/');
    openIssuesUnassignedLink = openIssuesLink.replace('state=open', 'q=is%3Aopen+no%3Aassignee');
    core.setOutput(
      'openIssuesLink',
      openIssuesLink,
    );
    core.setOutput(
      'openIssuesUnassignedLink',
      openIssuesUnassignedLink,
    );
    core.setOutput('openIssueSummary', {
      openIssues: openIssues.length,
      openIssuesUnassigned: openUnassignedIssues.length,
      openIssuesLink,
      openIssuesUnassignedLink,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
