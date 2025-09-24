package fileutils

import (
	"bytes"
	"strings"
	"time"

	"github.com/adrg/frontmatter"
	"github.com/peterszarvas94/lytepage/pkg/config"
	"github.com/yuin/goldmark"
	emoji "github.com/yuin/goldmark-emoji"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
)

type FrontMatter struct {
	Title    string   `yaml:"title"`
	Category string   `yaml:"category"`
	Tags     []string `yaml:"tags"`
	Date     string   `yaml:"date"`
	Time     string   `yaml:"time"`
	Excerpt  string   `yaml:"excerpt"`
	Hidden   bool     `yaml:"hidden"`
}

func parseFrontMatter(input string) (FrontMatter, string) {
	var frontMatter FrontMatter

	body, err := frontmatter.MustParse(strings.NewReader(input), &frontMatter)
	if err != nil {
		return frontMatter, input
	}

	return frontMatter, string(body)
}

func parseFileContent(input string) (string, error) {
	markdown := goldmark.New(
		goldmark.WithExtensions(
			extension.GFM,
			extension.DefinitionList,
			extension.Footnote,
			emoji.Emoji,
		),
		goldmark.WithParserOptions(
			parser.WithAttribute(),
		),
	)

	var buf bytes.Buffer
	if err := markdown.Convert([]byte(input), &buf); err != nil {
		return "", err
	}

	return buf.String(), nil
}

func parseDateTime(matter *FrontMatter) time.Time {
	parsedDate, err := time.Parse(config.DateLayout, matter.Date)
	if err != nil {
		return time.Now()
	}

	parseTime, err := time.Parse(config.TimeLayout, matter.Time)
	if err != nil {
		return time.Now()
	}

	dateTime := time.Date(
		parsedDate.Year(),
		parsedDate.Month(),
		parsedDate.Day(),
		parseTime.Hour(),
		parseTime.Minute(),
		parseTime.Second(),
		0,
		time.Local,
	)

	return dateTime
}
