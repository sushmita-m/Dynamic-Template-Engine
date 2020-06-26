import * as core from '@actions/core';
import * as github from '@actions/github';

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('githubToken');
    const octokit = github.getOctokit(token);
    const { repo, owner } = github.context.repo;
    const allIssueResponse = await octokit.issues.listForRepo({
      repo,
      owner,
      state: 'all',
    });
    const openIssueResponse = await octokit.issues.listForRepo({
      repo,
      owner,
      state: 'open',
    });
    const closedIssueResponse = await octokit.issues.listForRepo({
      repo,
      owner,
      state: 'closed',
    });
    const allIssues = allIssueResponse.data;
    const allIssuesResp: any = allIssueResponse;
    const openIssues = openIssueResponse.data;
    const openIssuesResp: any = openIssueResponse;
    const closedIssues = closedIssueResponse.data;
    const closedIssuesResp: any = closedIssueResponse;
    let allIssuesLink: string = allIssuesResp.url;
    let openIssuesLink: string = allIssuesResp.url;
    let closedIssuesLink: string = allIssuesResp.url;
    core.setOutput('allIssues', `${allIssues.length}`);
    core.setOutput('openIssues', `${openIssues.length}`);
    core.setOutput('closedIssues', `${closedIssues.length}`);
    allIssuesLink = allIssuesLink.replace('api.github.com/repos/', 'github.com/');
    openIssuesLink = allIssuesLink + '?q=is%3Aopen+is%3Aissue';
    closedIssuesLink = allIssuesLink + '?q=is%3Aissue+is%3Aclosed';
    core.setOutput(
      'allIssuesLink',
      allIssuesLink,
    );
    core.setOutput(
      'openIssuesLink',
      openIssuesLink,
    );
    core.setOutput(
      'closedIssuesLink',
      closedIssuesLink,
    );
    core.setOutput('openIssueSummary', {
      allIssues: allIssues.length,
      openIssues: openIssues.length,
      closedIssues: closedIssues.length,
      allIssuesLink,
      openIssuesLink,
      closedIssuesLink,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
