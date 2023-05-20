interface Layouts {
	// TODO: consider things like `iconSize`
	tabs: { type: "tabs", size?: string, tabBarSide?: Side, textDirection?: Direction, children: (AnyLayout & { name?: string, icon?: string })[] }
}
