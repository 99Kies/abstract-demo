'use client'

import { cw20Base } from "../_generated/generated-abstract"
import { useAccounts } from "@abstract-money/react"
import { useAccount } from "graz"
import { useAccountsMetadataGraphQLQuery } from "../_hooks/useQueryAccountsById"
import { appChain } from "../../utils/chains"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/card"
import { Alert, AlertDescription, AlertTitle } from "../../components/alert"
import { AlertCircle } from "lucide-react"

const EXAMPLE_NEUTRONTESTNET_CW20 = "neutron1sj7exsjqgy460zky8t0u0cvjutu09fswqfq3trssq9z935dryl3snjeekf"


export const CodegenContract: React.FC = () => {
  const chainId = appChain.chainId

  const { data: cosmosAccount } = useAccount({ chainId })
  const { data: accounts } = useAccounts({
    args: {
      owner: cosmosAccount?.bech32Address ?? "",
      chains: [appChain.chainName],
    },
    query: {
      enabled: !!cosmosAccount?.bech32Address,
    },
  })
  const { data: accountsMetadata } = useAccountsMetadataGraphQLQuery({ accountIds: accounts })

  const { data: exampleCw20Balance, isLoading } = cw20Base.queries.useBalance({
    contractAddress: EXAMPLE_NEUTRONTESTNET_CW20,
    chainName: appChain.chainName,
    args: { address: accountsMetadata?.[0]?.address ?? "" },
    options: { enabled: !!accountsMetadata?.[0]?.address && !!EXAMPLE_NEUTRONTESTNET_CW20 },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Codegen Contract Example</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading balance...</p>
        ) : exampleCw20Balance ? (
          <div className="bg-gray-100 p-3 rounded-md">
            <h3 className="font-semibold mb-2">Balance for address: {accountsMetadata?.[0]?.address ?? ""}</h3>
            <p>
              <strong>Balance:</strong> {exampleCw20Balance.balance}
            </p>
          </div>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No balance found</AlertTitle>
            <AlertDescription>
              Connect your wallet and create an account to view your balance.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
