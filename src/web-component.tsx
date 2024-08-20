import ReactDom from "react-dom/client";
import Widget from "@/components/Widget";

export const normalizeAttribute = (attribute: string) => {
	return attribute.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

class WidgetWebComponent extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	connectedCallback() {
		const props = this.getPropsFromAttributes();
		const root = ReactDom.createRoot(this.shadowRoot as ShadowRoot);
		root.render(<Widget {...props} />);
	}

	private getPropsFromAttributes() {
		const props: Record<string, string> = {};

		for (let index = 0; index < this.attributes.length; index++) {
			const attribute = this.attributes[index];
			props[normalizeAttribute(attribute.name)] = attribute.value;
		}

		return props;
	}
}

export default WidgetWebComponent;
