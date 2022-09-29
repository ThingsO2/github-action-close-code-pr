jest.mock('@actions/core')
import { Octokit } from "@octokit/core"
import { searchPRwithLabels } from '../src/searchPRwithLabels'

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})

const nooctokit = new Octokit({
    auth: '1234567890'
})

const repoName = 'monom-manifests'
const owner = 'ThingsO2'

test('search PR with Labels', async () => {
    const issue = await searchPRwithLabels(octokit, repoName, owner, ['test'])
    expect(issue).toEqual([15])
})

test('search PR with Labels no found', async () => {
    const issue = await searchPRwithLabels(octokit, repoName, owner, ['test-no-found'])
    expect(issue).toEqual([])
})

test('search PR with Labels error', async () => {
    try {
        await searchPRwithLabels(nooctokit, repoName, owner, ['test'])
    } catch (error) {
        expect(error).toHaveProperty('status', 401)
    }
})
