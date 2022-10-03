jest.mock('@actions/core')
import { Octokit } from "@octokit/core"
import { RequestError } from "@octokit/request-error"
import { getLabels } from '../src/getLabels'

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})

const nooctokit = new Octokit({
    auth: '1234567890'
})

const prNumber = 15
const repoName = 'monom-manifests'
const owner = 'ThingsO2'

test('get labels', async () => {
    const labels = await getLabels(octokit, prNumber, repoName, owner)
    expect(labels).toEqual(['test'])
})

test('get labels not found', async () => {
    try {
        await getLabels(octokit, 999, repoName, owner)
    } catch (error) {
        expect(error).toBeInstanceOf(RequestError)
        expect(error).toHaveProperty('status', 404)
    }
})

test('get labels error', async () => {
    try {
        await getLabels(nooctokit, prNumber, repoName, owner)
    } catch (error) {
        expect(error).toBeInstanceOf(RequestError)
        expect(error).toHaveProperty('status', 401)
    }
})
