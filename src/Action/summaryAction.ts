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
    const openIssuesLink: string = openIssuesResp.url;
    const openUnassignedIssues = openUnassignedIssueResponse.data;
    core.setOutput('openIssues', `${openIssues.length}`);
    core.setOutput('openIssuesUnassigned', `${openUnassignedIssues.length}`);
    core.setOutput(
      'openIssuesLink',
      openIssuesLink.replace('api.github.com/repos/', 'github.com/'),
    );
    core.setOutput(
      'openIssuesUnassignedLink',
      openIssuesLink
        .replace('api.github.com/repos/', 'github.com/')
        .replace('state=open', 'q=is%3Aopen+no%3Aassignee'),
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
