jest.mock('@actions/core')
jest.mock('../src/getLabels')
jest.mock('../src/searchPRwithLabels')
jest.mock('../src/searchCodePR')
jest.mock('../src/mergePR')
jest.mock('../src/postComment')

import * as core from '@actions/core'
import { Octokit } from "@octokit/core"
import { main } from '../src/main'
import { getLabels } from '../src/getLabels'
import { searchPRwithLabels } from '../src/searchPRwithLabels'
import { searchCodePR } from '../src/searchCodePR'
import { postComment } from '../src/postComment'

const mockedGetLabels = getLabels as jest.MockedFunction<typeof getLabels>
const mockedSearchPRwithLabels = searchPRwithLabels as jest.MockedFunction<typeof searchPRwithLabels>
const mockedSearchCodePR = searchCodePR as jest.MockedFunction<typeof searchCodePR>
const mockedPostComment = postComment as jest.MockedFunction<typeof postComment>

const octokit = new Octokit({
    auth: 'test-token'
})

const input = {
    prNumber: 135,
    repoName: 'monom-manifests',
    owner: 'ThingsO2'
}

describe('main with comments and actor', () => {
    const originalEnv = process.env

    beforeEach(() => {
        jest.clearAllMocks()
        process.env = { ...originalEnv, GITHUB_ACTOR: 'test-actor' }
    })

    afterAll(() => {
        process.env = originalEnv
    })

    test('should post comment with actor mention when other open PRs are found', async () => {
        mockedGetLabels.mockResolvedValue(['env-test'])
        mockedSearchPRwithLabels.mockResolvedValue([135, 136]) // 136 is "other"
        mockedSearchCodePR.mockResolvedValue({
            number: 10,
            base: {
                repo: {
                    name: 'original-repo',
                    owner: { login: 'ThingsO2' }
                }
            }
        } as any)

        const result = await main(octokit, input, true)

        expect(result).toBe(core.ExitCode.Success)
        expect(mockedPostComment).toHaveBeenCalledWith(
            expect.anything(),
            10,
            'original-repo',
            'ThingsO2',
            '@test-actor: Other open PRs found for these labels: 136. Nothing to merge yet.'
        )
    })

    test('should NOT post comment when NO other open PRs are found', async () => {
        mockedGetLabels.mockResolvedValue(['env-test'])
        mockedSearchPRwithLabels.mockResolvedValue([135]) // Only current PR
        mockedSearchCodePR.mockResolvedValue({
            number: 10,
            base: {
                repo: {
                    name: 'original-repo',
                    owner: { login: 'ThingsO2' }
                }
            }
        } as any)

        await main(octokit, input, false) // merge=false

        expect(mockedPostComment).not.toHaveBeenCalled()
    })
})
