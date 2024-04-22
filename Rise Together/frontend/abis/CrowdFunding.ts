import { Abi } from 'viem'

export const crowdFundingAbi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "contributor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "campaignIndex",
				"type": "uint256"
			}
		],
		"name": "Contribution",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "stage",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "campaignIndex",
				"type": "uint256"
			}
		],
		"name": "StageCompletion",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "campaignIndex",
				"type": "uint256"
			}
		],
		"name": "Withdrawal",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_campaignIndex",
				"type": "uint256"
			}
		],
		"name": "approveCampaign",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "campaigns",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "details",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "thumbnailUrl",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "campaignExpiry",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalFunds",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "paidfunds",
				"type": "uint256"
			},
			{
				"internalType": "enum FundingCampaign.CampaignStage",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "whichStage",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "stage1Completed",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "stage2Completed",
				"type": "bool"
			},
			{
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "adminApproved",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_campaignIndex",
				"type": "uint256"
			}
		],
		"name": "contribute",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_details",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_thumbnailUrl",
				"type": "string"
			},
			{
				"internalType": "uint256[]",
				"name": "_amounts",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256",
				"name": "_expiryTimestamp",
				"type": "uint256"
			},
			{
				"internalType": "string[]",
				"name": "_documentsLinks",
				"type": "string[]"
			}
		],
		"name": "createCampaign",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_campaignIndex",
				"type": "uint256"
			}
		],
		"name": "endStageVoting",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_campaignIndex",
				"type": "uint256"
			}
		],
		"name": "froceStopCampaign",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getBasicCampaignData",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "details",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "thumbnailUrl",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "campaignExpiry",
						"type": "uint256"
					},
					{
						"internalType": "string[]",
						"name": "documentsLinks",
						"type": "string[]"
					},
					{
						"internalType": "uint256[]",
						"name": "amounts",
						"type": "uint256[]"
					},
					{
						"internalType": "uint256",
						"name": "totalFunds",
						"type": "uint256"
					},
					{
						"internalType": "enum FundingCampaign.CampaignStage",
						"name": "status",
						"type": "uint8"
					},
					{
						"internalType": "string",
						"name": "whichStage",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "stage1Completed",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "stage2Completed",
						"type": "bool"
					},
					{
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "adminApproved",
						"type": "bool"
					}
				],
				"internalType": "struct FundingCampaign.SingleData",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getCampaignContributorsList",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_campaignIndex",
				"type": "uint256"
			}
		],
		"name": "getCampaignsByContributor",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "stage1donation",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "stage2donation",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "voted",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "votedFor",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "votedAgainst",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "numberOfContributors",
						"type": "uint256"
					}
				],
				"internalType": "struct FundingCampaign.ContributorsData[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getData",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "details",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "thumbnailUrl",
						"type": "string"
					},
					{
						"internalType": "uint256[]",
						"name": "amounts",
						"type": "uint256[]"
					},
					{
						"internalType": "uint256",
						"name": "totalFunds",
						"type": "uint256"
					},
					{
						"internalType": "enum FundingCampaign.CampaignStage",
						"name": "status",
						"type": "uint8"
					},
					{
						"internalType": "string",
						"name": "whichStage",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "stage1Completed",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "stage2Completed",
						"type": "bool"
					},
					{
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "adminApproved",
						"type": "bool"
					},
					{
						"internalType": "string[]",
						"name": "documentsLinks",
						"type": "string[]"
					},
					{
						"internalType": "uint256",
						"name": "campaignExpiry",
						"type": "uint256"
					}
				],
				"internalType": "struct FundingCampaign.CampaignData[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_creator",
				"type": "address"
			}
		],
		"name": "getDataByCreator",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "details",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "thumbnailUrl",
						"type": "string"
					},
					{
						"internalType": "uint256[]",
						"name": "amounts",
						"type": "uint256[]"
					},
					{
						"internalType": "uint256",
						"name": "totalFunds",
						"type": "uint256"
					},
					{
						"internalType": "enum FundingCampaign.CampaignStage",
						"name": "status",
						"type": "uint8"
					},
					{
						"internalType": "string",
						"name": "whichStage",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "stage1Completed",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "stage2Completed",
						"type": "bool"
					},
					{
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "adminApproved",
						"type": "bool"
					},
					{
						"internalType": "string[]",
						"name": "documentsLinks",
						"type": "string[]"
					},
					{
						"internalType": "uint256",
						"name": "campaignExpiry",
						"type": "uint256"
					}
				],
				"internalType": "struct FundingCampaign.CampaignData[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_campaignIndex",
				"type": "uint256"
			}
		],
		"name": "getStageContributionsLength",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getUserCampaignIndices",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_campaignIndex",
				"type": "uint256"
			}
		],
		"name": "isAdminApproved",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "platformBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "campaignIndex",
				"type": "uint256"
			}
		],
		"name": "rejectCampaign",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_campaignIndex",
				"type": "uint256"
			}
		],
		"name": "startStage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_campaignIndex",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_accept",
				"type": "bool"
			}
		],
		"name": "voteForStage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawPlatformFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
] as Abi
