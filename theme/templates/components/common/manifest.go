package common

import (
	"encoding/json"
	"os"
)

type manifestEntry struct {
	File string `json:"file"`
}

type manifestData map[string]manifestEntry

var manifest manifestData

func init() {
	manifest = loadManifest("config/asset-manifest.json")
}

func loadManifest(filepath string) manifestData {
	data, err := os.ReadFile(filepath)
	if err != nil {
		return manifestData{}
	}

	m := make(manifestData)
	if err := json.Unmarshal(data, &m); err != nil {
		return manifestData{}
	}

	return m
}

func AssetFilename(name string) string {
	if entry, ok := manifest[name]; ok {
		return entry.File
	}
	return name
}
