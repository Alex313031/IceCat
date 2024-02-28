/** \file
 * \brief Functions that help to automate process of building wrapping code for FPD module
 *
 *  \author Copyright (C) 2021  Marek Salon
 *  \author Copyright (C) 2023  Martin Zmitko
 *
 *  \license SPDX-License-Identifier: GPL-3.0-or-later
 */
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <https://www.gnu.org/licenses/>.
//

/**
 *  Additional wrappers for specialized purposes.
 */
var additional_wrappers_init_code = `
	WrapHelper.shared["fpd_offsetHeight_set_cnt"] = 0;
	WrapHelper.shared["fpd_offsetWidth_set_cnt"] = 0;
`;
var additional_wrappers = [
	{
		parent_object: "HTMLElement.prototype",
		parent_object_property: "offsetHeight",
		wrapped_objects: [],
		post_wrapping_code: [
			{
				code_type: "object_properties",
				parent_object: "HTMLElement.prototype",
				parent_object_property: "offsetHeight",
				wrapped_objects: [
					{
						original_name: `
							Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetHeight") ? 
							Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetHeight")["get"] : 
							HTMLElement.prototype.offsetHeight
						`,
						wrapped_name: "originalD_get"
					}
				],
				wrapped_properties: [
					{
						property_name: "get",
						property_value: `function() {
							// workaround - style property is bound to HTMLElement instance, check fontFamily value with every access
							let font = this.style.fontFamily;
							if (WrapHelper.shared["fpd_offsetHeight_set_cnt"] < 1000) {
								updateCount("CSSStyleDeclaration.prototype.fontFamily", "set", [font]);
								WrapHelper.shared["fpd_offsetHeight_set_cnt"] += 1;
							}
							return originalD_get.call(this);
						}`
					}
				]
			}
		]
	},
	{
		parent_object: "HTMLElement.prototype",
		parent_object_property: "offsetWidth",
		wrapped_objects: [],
		post_wrapping_code: [
			{
				code_type: "object_properties",
				parent_object: "HTMLElement.prototype",
				parent_object_property: "offsetWidth",
				wrapped_objects: [
					{
						original_name: `
							Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth") ? 
							Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth")["get"] : 
							HTMLElement.prototype.offsetWidth
						`,
						wrapped_name: "originalD_get"
					}
				],
				wrapped_properties: [
					{
						property_name: "get",
						property_value: `function() {
							// workaround - style property is bound to HTMLElement instance, check fontFamily value with every access
							let font = this.style.fontFamily;
							if (WrapHelper.shared["fpd_offsetWidth_set_cnt"] < 1000) {
								updateCount("CSSStyleDeclaration.prototype.fontFamily", "set", [font]);
								WrapHelper.shared["fpd_offsetWidth_set_cnt"] += 1;
							}
							return originalD_get.call(this);
						}`
					}
				]
			}
		]
	}
]

/**
 * The function that generates wrapping code from FPD wrappers when JSS hasn't wrapped anything.
 *
 * \param fpd_wrappers Array of wrappers defined by FPD configuration.
 * 
 * \returns Injectable code created from FPD wrappers.
 */
function fp_generate_from_wrappers(fpd_wrappers, fpdTrackCallers) {
	// define wrapper for each FPD endpoint (using default JSS definition of wrappers)
	let tmp_build_wrapping_code = {};
	for (let wrap_item of fpd_wrappers) {
		if (wrap_item[1]) { // wrap_item.type === "property"
			tmp_build_wrapping_code[wrap_item[0]] = fp_build_property_wrapper(wrap_item);
		}
		else { // wrap_item.type === "function"
			tmp_build_wrapping_code[wrap_item[0]] = fp_build_function_wrapper(wrap_item);
		}
	}

	// if there is an additional wrapper for resource, overwrite default definition with it
	for (let additional_item of additional_wrappers) {
		let { parent_object, parent_object_property } = additional_item;
		let resource = `${parent_object}.${parent_object_property}`;
		if (resource in tmp_build_wrapping_code) {
			tmp_build_wrapping_code[resource] = additional_item;
		}
	}

	// transform each wrapper to wrapping code
	let fp_wrapped_codes = {};
	for (let build_item in tmp_build_wrapping_code) {
		try {
			fp_wrapped_codes[build_item] = build_code(fpdTrackCallers, tmp_build_wrapping_code[build_item]);
		} catch (e) {
			console.error(e);
			fp_wrapped_codes[build_item] = "";
		}
	}
	return fp_wrapped_codes;
}

/**
 * The function that appends FPD wrappers into injectable code, if JSS hasn't wrapped certain FPD endpoints already.
 *
 * \param code String containing injectable code generated by "generate_code" method.
 * \param jss_wrappers Array of wrappers defined by JSS level object.
 * \param fpd_level Identifier of the current FPD level/config.
 * 
 * \returns Modified injectable code that also contains FPD wrapping code.
 */
function fp_update_wrapping_code(code, jss_wrappers, fpd_wrappers, fpdTrackCallers) {
	const jss_wrapper_resources = jss_wrappers.map(x => x[0]);
	const fpd_wrappers_filtered = fpd_wrappers.filter(w => !jss_wrapper_resources.includes(w[0]));
	const fpd_wrapped_codes = fp_generate_from_wrappers(fpd_wrappers_filtered, fpdTrackCallers);
	const fpd_code = joinWrappingCode(Object.values(fpd_wrapped_codes));
	return code.replace("// FPD_S\n", `// FPD_S\n${additional_wrappers_init_code} ${fpd_code}`);
}

/**
 * The function that creates injectable code specifically for FPD wrappers in case that JSS hasn't wrapped anything.
 *
 * \param fpd_wrappers Array of wrappers defined by FPD configuration.
 * 
 * \returns Injectable code containing only FPD wrapping code.
 */
function fp_generate_wrapping_code(fpd_wrappers, fpdTrackCallers) {
	let fpd_wrapped_codes = fp_generate_from_wrappers(fpd_wrappers, fpdTrackCallers);
	return generate_code("// FPD_S\n" + additional_wrappers_init_code + joinWrappingCode(Object.values(fpd_wrapped_codes)) + "\n// FPD_E");
}

/**
 * The function splitting resource string into path and name.
 * For example: "window.navigator.userAgent" => path: "window.navigator", name: "userAgent"
 *
 * \param wrappers text String representing full name of resource.
 * 
 * \returns Object consisting of two properties (path, name) for given resource.
 */
function split_resource(text) {
	var index = text.lastIndexOf('.');
	return {
		path: text.slice(0, index),
		name: text.slice(index + 1)
	}
}

/**
 * The function that constructs implicit property wrapper object from FPD configuration.
 * 
 * \param wrap_item Single resource object from FPD wrappers definition.
 * 
 * \returns New declarative property wrapper supported by code_builder (same structure as explicitly defined wrappers).
 */
function fp_build_property_wrapper(wrap_item) {
	// return object initialization
	var wrapper_object = {};

	// if properties to wrap exist, create property wrapper based on wrap_item input
	if (wrap_item[2].size != 0) {
		var resource_splitted = split_resource(wrap_item[0]);
		wrapper_object = {
			parent_object: resource_splitted["path"],
			parent_object_property: resource_splitted["name"],
			wrapped_objects: [],
			post_wrapping_code: [
				{
					code_type: "object_properties",
					parent_object: resource_splitted["path"],
					parent_object_property: resource_splitted["name"],
					wrapped_objects: [],
					wrapped_properties: [],
					report_args: wrap_item[3],
				}
			],
		};

		// create post_wrapping_code to wrap every property type
		for (let type of wrap_item[2]) {

			// save original resource - get property from descriptor, if do not exists, save it directly
			wrapper_object.post_wrapping_code[0].wrapped_objects.push({
				original_name: `
					Object.getOwnPropertyDescriptor(${resource_splitted["path"]}, "${resource_splitted["name"]}") ?
					Object.getOwnPropertyDescriptor(${resource_splitted["path"]}, "${resource_splitted["name"]}")["${type}"] :
					${type == "get" ? wrap_item[0] : undefined}
				`,
				wrapped_name: `originalD_${type}`,
			});

			// return original property (do not change semantics)
			wrapper_object.post_wrapping_code[0].wrapped_properties.push({
				property_name: type,
				property_value: `
					originalD_${type}
				`,
			})
		};
	}
	return wrapper_object;
}

/**
 * The function that constructs implicit function wrapper object from FPD configuration.
 * 
 * \param wrap_item Single resource object from FPD wrappers definition.
 * 
 * \returns New declarative function wrapper supported by code_builder (same structure as explicitly defined wrappers).
 */
function fp_build_function_wrapper(wrap_item) {
	var resource_splitted = split_resource(wrap_item[0]);

	var wrapper_object = {
		parent_object: resource_splitted["path"],
		parent_object_property: resource_splitted["name"],

		// save original function into variable
		wrapped_objects: [{
			original_name: `${resource_splitted["path"]}.${resource_splitted["name"]}`,
			wrapped_name: `originalF_${resource_splitted["name"]}`
		}],
		wrapping_function_args: "...args",

		// call original function on return with same arguments and context (do not change semantics)
		wrapping_function_body: `
			return originalF_${resource_splitted["name"]}.call(this, ...args);
		`,
		report_args: wrap_item[3],
	};
	return wrapper_object;
}

/**
 * The function that adds argument reporting settings to every JSS wrapper definition where specified by FPD configuration.
 * This is for removing unnecessary reporting of arguments in cases where the arguments may be large
 * (such as arrays for image/audio data), which results in their slow synchronous serialization.
 * 
 * \param fpd_wrappers Array of wrappers defined by FPD configuration.
 */
function fp_append_reporting_to_jss_wrappers(fpd_wrappers) {
	const resources_with_reporting = new Set(fpd_wrappers.map(w => w[3] ? w[0] : undefined));
	resources_with_reporting.delete(undefined);
	function append_reporting(wrapper) {
		let {parent_object, parent_object_property} = wrapper;
		let resource = `${parent_object}.${parent_object_property}`;
		wrapper.report_args = resources_with_reporting.has(resource);
	}

	for (let wrapper of Object.values(build_wrapping_code)) {
		append_reporting(wrapper);
		if (wrapper.post_wrapping_code) {
			// Objects wrapped in post wrapping code might be tracked as well
			Object.values(wrapper.post_wrapping_code).forEach(append_reporting);
		}
	}
}
