/**
 * @typedef ThemeOutput
 * @type {object}
 * @property {object} tokens CSS object literals with CSS vars in place of array values
 * @property {object} vars CSS custom properties sorted into the provided containers (e.g. for use with media queries)
 * @returns
 */

/**
 * Repackages array values in CSS object literals with CSS vars.
 *
 * @param {object} config
 * @param {object} config.styles Object literal CSS styles with array values for CSS var tokenizing
 * @param {Array} config.containers Indexed containers for array values to sort into (e.g media queries associated with each array position)
 * @returns {ThemeOutput} Object with `tokens` and `vars`
 */
const buildTheme = ({ styles, containers }) => {
  const vars = containers.reduce((output, key) => {
    output[key] = {}
    return output
  }, {})

  return Object.entries(styles).reduce(
    (output, [selector, properties]) => {
      output.tokens[selector] = Object.entries(properties).reduce(
        (preparedProperties, [property, value]) => {
          if (Array.isArray(value)) {
            const varName = `--${selector}${upperFirst(property)}`

            value.forEach(
              (v, index) =>
                (output.vars[containers[index]][varName] =
                  typeof v === "number" ? `${v}px` : v)
            )

            preparedProperties[property] = `var(${varName}, ${
              output.vars[containers[0]][varName]
            })`
          } else {
            preparedProperties[property] = value
          }

          return preparedProperties
        },
        {}
      )

      return output
    },
    { vars, tokens: {} }
  )
}

export default buildTheme

const upperFirst = (input) => input[0].toUpperCase() + input.slice(1)
