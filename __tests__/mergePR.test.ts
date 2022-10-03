jest.mock('@actions/core')
import { Octokit } from "@octokit/core"
import { RequestError } from "@octokit/request-error"
import { mergePR } from '../src/mergePR'

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})

const nooctokit = new Octokit({
    auth: '1234567890'
})

const prNumber = 8
const repoName = 'github-action-close-code-pr'
const owner = 'ThingsO2'

test('merge PR', async () => {
    const mergeResult = await mergePR(octokit, prNumber, repoName, owner)
    expect(mergeResult).toBeDefined()
    expect(mergeResult.merged).toBeTruthy()
    expect(mergeResult.message).toEqual('Pull Request successfully merged')
})

test('merge PR already merged', async () => {
    try {
        await mergePR(octokit, 5, repoName, owner)
    } catch (error) {
        expect(error).toBeInstanceOf(RequestError)
        expect(error).toHaveProperty('status', 405)
    }
})

test('merge PR no token', async () => {
    try {
        await mergePR(nooctokit, prNumber, repoName, owner)
    } catch (error) {
        expect(error).toBeInstanceOf(RequestError)
        expect(error).toHaveProperty('status', 401)
    }
})
