import { useCallback, useState } from "react"
import knuthShuffle from "knuth-shuffle-seeded"
import { Trans } from "react-i18next"
import { VSCodeButton, VSCodeLink } from "@vscode/webview-ui-toolkit/react"

import type { ProviderSettings } from "@roo-code/types"

import { useExtensionState } from "@src/context/ExtensionStateContext"
import { validateApiConfiguration } from "@src/utils/validate"
import { vscode } from "@src/utils/vscode"
import { useAppTranslation } from "@src/i18n/TranslationContext"
import { getRequestyAuthUrl, getOpenRouterAuthUrl } from "@src/oauth/urls"

import ApiOptions from "../settings/ApiOptions"
import { Tab, TabContent } from "../common/Tab"

import RooHero from "./RooHero"

const WelcomeView = () => {
	const { apiConfiguration, currentApiConfigName, setApiConfiguration, uriScheme, machineId } = useExtensionState()
	const { t } = useAppTranslation()
	const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
	const [showLogin, setShowLogin] = useState(true)

	// Memoize the setApiConfigurationField function to pass to ApiOptions
	const setApiConfigurationFieldForApiOptions = useCallback(
		<K extends keyof ProviderSettings>(field: K, value: ProviderSettings[K]) => {
			setApiConfiguration({ [field]: value })
		},
		[setApiConfiguration], // setApiConfiguration from context is stable
	)

	const handleSubmit = useCallback(() => {
		const error = apiConfiguration ? validateApiConfiguration(apiConfiguration) : undefined

		if (error) {
			setErrorMessage(error)
			return
		}

		setErrorMessage(undefined)
		vscode.postMessage({ type: "upsertApiConfiguration", text: currentApiConfigName, apiConfiguration })
	}, [apiConfiguration, currentApiConfigName])

	const handleLogin = useCallback(() => {
		// This will be replaced with actual login URL later
		const loginUrl = "http://localhost:3000/login"
		vscode.postMessage({ type: "openExternalUrl", url: loginUrl })
	}, [])

	// Using a lazy initializer so it reads once at mount
	const [imagesBaseUri] = useState(() => {
		const w = window as any
		return w.IMAGES_BASE_URI || ""
	})

	if (showLogin) {
		return (
			<Tab>
				<TabContent className="flex flex-col items-center justify-center gap-5 p-16 h-full">
					<RooHero />
					<h2 className="mt-0 mb-0">{t("welcome:greeting")}</h2>
					<p className="text-center">{t("welcome:introduction")}</p>
					<VSCodeButton onClick={handleLogin} appearance="primary">
						{t("welcome:login")}
					</VSCodeButton>
					<VSCodeLink
						href="https://salesforce-ide-c1761.web.app/"
						onClick={(e) => {
							e.preventDefault()
							setShowLogin(false)
						}}>
						{t("welcome:continueWithoutLogin")}
					</VSCodeLink>
				</TabContent>
			</Tab>
		)
	}

	return (
		<Tab>
			<TabContent className="flex flex-col gap-5 p-16">
				<RooHero />
				<h2 className="mt-0 mb-0">{t("welcome:greeting")}</h2>

				<div className="font-bold">
					<p>
						<Trans i18nKey="welcome:introduction" />
					</p>
					<p>
						<Trans i18nKey="welcome:chooseProvider" />
					</p>
				</div>

				<div className="mb-4">
					<p className="font-bold mt-0">{t("welcome:startRouter")}</p>

					<div>
						{/* Define the providers */}
						{(() => {
							// Provider card configuration
							const providers = [
								{
									slug: "requesty",
									name: "Requesty",
									description: t("welcome:routers.requesty.description"),
									incentive: t("welcome:routers.requesty.incentive"),
									authUrl: getRequestyAuthUrl(uriScheme),
								},
								{
									slug: "openrouter",
									name: "OpenRouter",
									description: t("welcome:routers.openrouter.description"),
									authUrl: getOpenRouterAuthUrl(uriScheme),
								},
							]

							// Shuffle providers based on machine ID (will be consistent for the same machine)
							const orderedProviders = [...providers]
							knuthShuffle(orderedProviders, (machineId as any) || Date.now())

							// Render the provider cards
							return orderedProviders.map((provider, index) => (
								<a
									key={index}
									href={provider.authUrl}
									className="flex-1 border border-vscode-panel-border hover:bg-secondary rounded-lg py-4 px-6 mb-2 flex flex-row gap-4 cursor-pointer transition-all no-underline text-inherit"
									target="_blank"
									rel="noopener noreferrer">
									<div className="w-10 h-10">
										<img
											src={`${imagesBaseUri}/${provider.slug}.png`}
											alt={provider.name}
											className="w-full h-full object-contain"
										/>
									</div>
									<div>
										<div className="font-bold text-vscode-foreground">{provider.name}</div>
										<div>
											<div className="text-xs text-vscode-descriptionForeground">
												{provider.description}
											</div>
											{provider.incentive && (
												<div className="text-xs font-bold">{provider.incentive}</div>
											)}
										</div>
									</div>
								</a>
							))
						})()}
					</div>

					<p className="font-bold mt-8 mb-6">{t("welcome:startCustom")}</p>
					<ApiOptions
						fromWelcomeView
						apiConfiguration={apiConfiguration || {}}
						uriScheme={uriScheme}
						setApiConfigurationField={setApiConfigurationFieldForApiOptions}
						errorMessage={errorMessage}
						setErrorMessage={setErrorMessage}
					/>
				</div>
			</TabContent>
			<div className="sticky bottom-0 bg-vscode-sideBar-background p-5">
				<div className="flex flex-col gap-1">
					<div className="flex justify-end">
						<VSCodeLink
							href="#"
							onClick={(e) => {
								e.preventDefault()
								vscode.postMessage({ type: "importSettings" })
							}}
							className="text-sm">
							{t("welcome:importSettings")}
						</VSCodeLink>
					</div>
					<VSCodeButton onClick={handleSubmit} appearance="primary">
						{t("welcome:start")}
					</VSCodeButton>
					{errorMessage && <div className="text-vscode-errorForeground">{errorMessage}</div>}
				</div>
			</div>
		</Tab>
	)
}

export default WelcomeView
