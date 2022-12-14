jest.mock('@actions/core')
import { Octokit } from "@octokit/core"
import { searchCodePR } from '../src/searchCodePR'

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})

const nooctokit = new Octokit({
    auth: '1234567890'
})

const prNumber = 135
const repoName = 'monom-manifests'
const owner = 'ThingsO2'

test('search code PR', async () => {
    const res = await searchCodePR(octokit, prNumber, repoName, owner)
    expect(res).toBeDefined()
    expect(res?.number).toBe(36)
    expect(res?.head.repo.name).toBe('dp-monom-2-awm')
})

test('search code PR not found', async () => {
    try {
        await searchCodePR(octokit, 15, repoName, owner)
    } catch (error) {
        expect(error).toHaveProperty('status', 404)
    }
})

test('search code PR error', async () => {
    try {
        await searchCodePR(nooctokit, prNumber, repoName, owner)
    } catch (error) {
        expect(error).toHaveProperty('status', 401)
    }
})