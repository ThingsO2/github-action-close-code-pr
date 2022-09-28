jest.mock('@actions/core')
import * as core from '@actions/core'
import { Octokit } from "@octokit/core"
import { main } from '../src/main'

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})

const nooctokit = new Octokit({
    auth: '1234567890'
})

const input = {
    prNumber: '135',
    repoName: 'monom-manifests',
    owner: 'ThingsO2'
}

test('main', async () => {
    const mainResult = await main(octokit, input, false)
    expect(mainResult).toBe(core.ExitCode.Success)
})

test('main failed', async () => {
    const mainResult = await main(nooctokit, input, false)
    expect(mainResult).toBe(core.ExitCode.Failure)
})
