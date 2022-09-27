jest.mock('@actions/core')
import { Octokit } from "@octokit/core"
import { getLabels } from '../src/getLabels'

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})

const nooctokit = new Octokit({
    auth: '1234567890'
})

const prNumber = '15'
const repoName = 'monom-manifests'
const owner = 'ThingsO2'

test('get labels', async () => {
    const labels = await getLabels(octokit, prNumber, repoName, owner)
    expect(labels).toEqual(['test'])
})

test('get labels not found', async () => {
    const labels = await getLabels(octokit, '99999', repoName, owner)
    expect(labels).toBeUndefined()
})

test('get labels error', async () => {
    const labels = await getLabels(nooctokit, prNumber, repoName, owner)
    expect(labels).toBeUndefined()
})
