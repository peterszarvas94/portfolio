package fileutils

import (
	"context"
	"io"

	"github.com/a-h/templ"
)

func HtmlString(html string) templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) (err error) {
		_, err = io.WriteString(w, html)
		return
	})
}

func StripHTMLTags(input string) string {
	var output string
	var inTag bool
	for _, r := range input {
		if r == '<' {
			inTag = true
			continue
		}
		if r == '>' {
			inTag = false
			continue
		}
		if !inTag {
			output += string(r)
		}
	}

	return output
}

// Not in use in favor of StripHTMLTags, might change in the future
// func GetFirsParagraphExcrept(input string) string {
// 	parts := strings.Split(input, "<p>")
//
// 	if len(parts) < 2 {
// 		return ""
// 	}
//
// 	afterOpeningTag := parts[1]
// 	parts = strings.Split(afterOpeningTag, "</p>")
// 	beforeClosingTag := parts[0]
//
// 	if len(beforeClosingTag) > 120 {
// 		excerpt := fmt.Sprintf("%s...", beforeClosingTag[:120])
// 		return excerpt
// 	}
//
// 	return beforeClosingTag
// }
