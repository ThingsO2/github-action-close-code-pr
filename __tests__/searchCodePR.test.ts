jest.mock('@actions/core')
import { Octokit } from "@octokit/core"
import { searchCodePR } from '../src/searchCodePR'

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})

const nooctokit = new Octokit({
    auth: '1234567890'
})

const prNumber = '135'
const repoName = 'monom-manifests'
const owner = 'ThingsO2'

test('searchCodePR', async () => {
    const res = await searchCodePR(octokit, prNumber, repoName, owner)
    expect(res).toBeDefined()
    expect(res?.number).toBe(36)
    expect(res?.head.repo.name).toBe('dp-monom-2-awm')
})
